# -*- coding: utf-8 -*-
"""
API Flask Fusionnée pour la Prédiction de Commandes et la Gestion des Données

Cette API combine les fonctionnalités de prédiction de la quantité à commander
avec la récupération d'informations sur les magasins, les produits et le stock.
"""

import pandas as pd
import pyodbc
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression  # Exemple de modèle
from sklearn.metrics import mean_squared_error
import joblib  # Pour sauvegarder et charger le modèle
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

SECRET_KEY = "your_secret_key"  # Changez cette clé pour plus de sécurité

users = {}  # Simule une base de données pour les utilisateurs

# --- Configuration de la base de données ---
DB_CONFIG = {
    'DRIVER': '{SQL Server}',
    'SERVER': 'localhost\\SQLEXPRESS',
    'DATABASE': 'GestionOS',
    'Trusted_Connection': 'yes',
}

def get_db_connection():
    """Établit une connexion à la base de données."""
    return pyodbc.connect(**DB_CONFIG)

# --- 1. Chargement et prétraitement des données pour le modèle de prédiction ---

def load_data_for_prediction():
    """Charge les données nécessaires depuis la base de données pour l'entraînement du modèle."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
        select S.Code_GOLD as magasin, D.EAN as produit,
                        T.DATE_DEBUT_VENTE as date_debut_consommation,
                        T.DATE_FIN_VENTE as date_fin_consommation,
                        OSE.Stock_Actuel as stock_actuel,
                        OSE.Engagement_arrondi_au_Colisage as quantite_a_commander
        from site S join ENSEIGNE E on S.ENS_ID=E.Id
                    join os on OS.ENS_ID= E.Id
                    join OS_DETAIL D on D.OS_ID = OS.Id
                    join OS_ENGAGEMENT OSE on OSE.OS_DETAIL_ID=D.Id
                    join THEME_TYPE TT on TT.ENS_ID = E.Id
                    join THEME T on T.Type_id=TT.Id;
        """
        df = pd.read_sql(query, conn)
        return df
    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        print(f"Erreur de base de données (chargement pour prédiction): {sqlstate}")
        return None
    finally:
        if conn:
            conn.close()

def preprocess_data(df):
    """Prétraite les données pour l'entraînement du modèle."""
    if df is None:
        return None

    # Convertir les dates en datetime
    df['date_debut_consommation'] = pd.to_datetime(df['date_debut_consommation'])
    df['date_fin_consommation'] = pd.to_datetime(df['date_fin_consommation'])

    # Calculer la durée de la période de consommation en jours
    df['duree_consommation'] = (df['date_fin_consommation'] - df['date_debut_consommation']).dt.days

    # Ajouter d'autres fonctionnalités pertinentes (exemple)
    df['mois_debut'] = df['date_debut_consommation'].dt.month

    # Gérer les valeurs manquantes (si nécessaire)
    df = df.dropna()

    # Encodage des variables catégorielles (magasin, produit)
    df = pd.get_dummies(df, columns=['magasin', 'produit'], drop_first=True)

    # Sélectionner les fonctionnalités et la variable cible
    features = [col for col in df.columns if col not in ['quantite_a_commander', 'date_debut_consommation', 'date_fin_consommation']]
    target = 'quantite_a_commander'

    return df[features], df[target]

# --- 2. Entraînement et chargement du modèle de prédiction ---

# Choisir un modèle (exemple : régression linéaire)
model = LinearRegression()
MODEL_PATH = 'commande_prediction_model.joblib'
features_columns = None # Pour stocker les noms des colonnes des features après l'entraînement

def train_model(features, target):
    """Entraîne le modèle sur les données fournies."""
    if features is None or target is None:
        print("Pas de données valides pour l'entraînement.")
        return None

    # Vérifier si le nombre d'échantillons est suffisant pour la division
    if len(features) < 2:
        print("Pas assez de données pour diviser en ensembles d'entraînement et de test.")
        model.fit(features, target)  # Entraîner sur toutes les données
        joblib.dump(model, MODEL_PATH)
        joblib.dump(features.columns.tolist(), 'features_columns.joblib')
        print(f"Modèle entraîné et sauvegardé avec toutes les données (n_samples={len(features)}).")
        return model, features.columns.tolist()

    # Diviser les données en ensembles d'entraînement et de test
    X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42)

    model.fit(X_train, y_train)

    # Évaluation du modèle (facultatif)
    predictions = model.predict(X_test)
    mse = mean_squared_error(y_test, predictions)
    print(f"Erreur quadratique moyenne sur l'ensemble de test: {mse}")

    # Sauvegarder le modèle entraîné et les noms des colonnes
    joblib.dump(model, MODEL_PATH)
    joblib.dump(features.columns.tolist(), 'features_columns.joblib')
    print(f"Modèle sauvegardé à : {MODEL_PATH}")
    print("Noms des colonnes des features sauvegardés.")
    return model, features.columns.tolist()

def load_trained_model():
    """Charge le modèle entraîné et les noms des colonnes depuis les fichiers."""
    try:
        loaded_model = joblib.load(MODEL_PATH)
        loaded_features_columns = joblib.load('features_columns.joblib')
        print("Modèle chargé avec succès.")
        print("Noms des colonnes des features chargés.")
        return loaded_model, loaded_features_columns
    except FileNotFoundError:
        print("Le fichier du modèle ou des noms de colonnes n'a pas été trouvé. Veuillez entraîner le modèle d'abord.")
        return None, None

# Charger le modèle et les noms des colonnes au démarrage (si déjà entraînés)
loaded_model, features_columns = load_trained_model()

# --- 3. Création de l'application Flask ---

app = Flask(__name__)
CORS(app)  # Autoriser les requêtes cross-origin

# --- 4. Points de terminaison API ---

# Add a flag to enable/disable token validation
ENABLE_TOKEN_VALIDATION = False  # Set to False to bypass token validation during development

def token_required(f):
    """Décorateur pour vérifier le token JWT."""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not ENABLE_TOKEN_VALIDATION:
            return f(*args, **kwargs)  # Skip token validation if disabled

        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Token manquant"}), 401
        try:
            jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expiré"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Token invalide"}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/predict', methods=['POST'])
@token_required
def predict_command():
    """Endpoint pour prédire la quantité à commander."""
    global loaded_model, features_columns
    if loaded_model is None or features_columns is None:
        return jsonify({"error": "Le modèle n'a pas été entraîné ou n'a pas pu être chargé."}), 500

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Données d'entrée non fournies."}), 400

        print("Données reçues pour la prédiction :", data)

        input_df = pd.DataFrame([data])

        # Convertir les dates (comme dans preprocess_data)
        input_df['date_debut_consommation'] = pd.to_datetime(input_df.get('date_debut_consommation'))
        input_df['date_fin_consommation'] = pd.to_datetime(input_df.get('date_fin_consommation'))

        # Calculer la durée de consommation et le mois de début (comme dans preprocess_data)
        input_df['duree_consommation'] = (input_df['date_fin_consommation'] - input_df['date_debut_consommation']).dt.days
        input_df['mois_debut'] = input_df['date_debut_consommation'].dt.month

        # Handle one-hot encoding for 'magasin' and 'produit'
        input_df = pd.get_dummies(input_df, columns=['magasin', 'produit'], drop_first=True)

        # Ensure all one-hot encoded columns from training are present
        for col in features_columns:
            if col not in input_df.columns:
                input_df[col] = 0

        # Set the correct one-hot encoded column for 'magasin' and 'produit' to 1
        magasin_col = f"magasin_{data['magasin']}"
        produit_col = f"produit_{data['produit']}"
        if magasin_col in input_df.columns:
            input_df[magasin_col] = 1
        if produit_col in input_df.columns:
            input_df[produit_col] = 1

        # Ensure the column order matches the training data
        input_df = input_df[features_columns]

        # Debugging: Log the final input data used for prediction
        print("DataFrame utilisé pour la prédiction :", input_df)

        # Faire la prédiction
        prediction = loaded_model.predict(input_df)[0]

        # Enregistrer la prédiction dans la table PredictionHistory
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            prediction_datetime = datetime.datetime.now(datetime.timezone.utc)
            insert_query = """
                INSERT INTO PredictionHistory 
                ([magasin], [produit], [date_debut_consommation], [date_fin_consommation], 
                 [stock_actuel], [quantite_predite], [prediction_datetime])
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """
            cursor.execute(insert_query, (
                data['magasin'],
                data['produit'],
                data['date_debut_consommation'],
                data['date_fin_consommation'],
                data['stock_actuel'],
                round(prediction),
                prediction_datetime
            ))
            conn.commit()
        except pyodbc.Error as ex:
            print(f"Erreur lors de l'enregistrement de la prédiction: {ex}")
            return jsonify({"error": "Erreur lors de l'enregistrement de la prédiction"}), 500
        finally:
            if conn:
                conn.close()

        # Réentraîner le modèle avec les nouvelles données
        new_data = pd.DataFrame([{
            "magasin": data['magasin'],
            "produit": data['produit'],
            "date_debut_consommation": data['date_debut_consommation'],
            "date_fin_consommation": data['date_fin_consommation'],
            "stock_actuel": data['stock_actuel'],
            "quantite_a_commander": round(prediction)
        }])
        new_features, new_target = preprocess_data(new_data)
        if new_features is not None and new_target is not None:
            train_model(new_features, new_target)

        return jsonify({"predicted_quantity": round(prediction)})

    except Exception as e:
        return jsonify({"error": f"Erreur lors de la prédiction: {e}"}), 500

@app.route('/train', methods=['POST'])
@token_required
def train_model_endpoint():
    """Endpoint pour entraîner manuellement le modèle avec de nouvelles données."""
    global loaded_model, features_columns
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Nouvelles données d'entraînement non fournies."}), 400

        new_df = pd.DataFrame(data)

        # **IMPORTANT:** Prétraiter les nouvelles données de la même manière
        new_features, new_target = preprocess_data(new_df.copy())

        if new_features is None or new_target is None:
            return jsonify({"error": "Erreur lors du prétraitement des nouvelles données."}), 400

        # Charger les données d'entraînement existantes (si elles existent)
        existing_data = load_data_for_prediction()
        if existing_data is not None:
            existing_features, existing_target = preprocess_data(existing_data.copy())

            if existing_features is not None and existing_target is not None:
                combined_features = pd.concat([existing_features, new_features], ignore_index=True)
                combined_target = pd.concat([existing_target, new_target], ignore_index=True)
                trained_model, updated_features_columns = train_model(combined_features, combined_target)
                if trained_model:
                    loaded_model = trained_model # Mettre à jour le modèle chargé
                    features_columns = updated_features_columns
                    return jsonify({"message": "Modèle réentraîné avec succès."}), 200
                else:
                    return jsonify({"error": "Le réentraînement du modèle a échoué."}), 500
            else:
                # Si les données existantes n'ont pas pu être prétraitées
                trained_model, updated_features_columns = train_model(new_features, new_target)
                if trained_model:
                    loaded_model = trained_model
                    features_columns = updated_features_columns
                    return jsonify({"message": "Modèle entraîné avec les nouvelles données."}), 200
                else:
                    return jsonify({"error": "L'entraînement du modèle avec les nouvelles données a échoué."}), 500
        else:
            # Si aucune donnée existante n'a pu être chargée
            trained_model, updated_features_columns = train_model(new_features, new_target)
            if trained_model:
                loaded_model = trained_model
                features_columns = updated_features_columns
                return jsonify({"message": "Modèle entraîné avec les nouvelles données."}), 200
            else:
                return jsonify({"error": "L'entraînement du modèle avec les nouvelles données a échoué."}), 500

    except Exception as e:
        return jsonify({"error": f"Erreur lors de l'entraînement manuel: {e}"}), 500

@app.route('/stores', methods=['GET'])
def get_stores():
    """Retourne la liste des magasins."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT Id, code_gold, LIB FROM Site")  # Inclure Id pour une utilisation ultérieure
        stores = [{"value": row.Id, "label": f"{row.code_gold} : {row.LIB}"} for row in cursor.fetchall()]
        return jsonify(stores)
    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        print(f"Erreur de base de données (magasins): {sqlstate}")
        return jsonify({"error": f"Erreur lors de la récupération des magasins: {sqlstate}"}), 500
    finally:
        if conn:
            conn.close()

@app.route('/products', methods=['GET'])
def get_products():
    """Retourne la liste des produits pour un magasin donné."""
    store_id = request.args.get('store_id')

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        if (store_id):
            query = """
                SELECT DET.Id, DET.EAN, DET.Produit
                FROM OS_ENGAGEMENT OSE
                JOIN SITE S ON OSE.Site_ID = S.Id
                JOIN OS_DETAIL DET ON OSE.OS_DETAIL_ID = DET.Id
                WHERE S.Id = ?
                GROUP BY DET.Id, DET.EAN, DET.Produit
            """
            cursor.execute(query, (store_id,))
            products = [{"value": row.Id, "label": f"{row.EAN} : {row.Produit}"} for row in cursor.fetchall()]
        else:
            # Si aucun store_id n'est fourni, retourner tous les produits (ou une liste vide, selon votre besoin)
            cursor.execute("SELECT Id, EAN, Produit FROM os_detail")
            products = [{"value": row.Id, "label": f"{row.EAN} : {row.Produit}"} for row in cursor.fetchall()]
        return jsonify(products)
    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        print(f"Erreur de base de données (produits): {sqlstate}")
        return jsonify({"error": f"Erreur lors de la récupération des produits: {sqlstate}"}), 500
    finally:
        if conn:
            conn.close()

@app.route('/stock', methods=['GET'])
def get_stock():
    """Retourne la quantité de stock pour un magasin et un produit donnés."""
    store_id = request.args.get('store_id')
    product_id = request.args.get('product_id')

    print(f"Received store_id: {store_id}, product_id: {product_id}")  # Debugging

    if not store_id or not product_id:
        return jsonify({"error": "Missing store_id or product_id"}), 400

    try:
        store_id = int(store_id)
        product_id = int(product_id)
    except ValueError:
        return jsonify({"error": "Invalid store_id or product_id"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT OSE.Stock_Actuel
            FROM OS_ENGAGEMENT OSE
            JOIN SITE S ON OSE.Site_ID = S.Id
            JOIN OS_DETAIL DET ON OSE.OS_DETAIL_ID = DET.Id
            WHERE DET.Id = ? AND S.Id = ?
        """, (product_id, store_id))
        result = cursor.fetchone()

        if result:
            print(f"Stock found: {result[0]}")  # Debugging
            return jsonify({"stock_quantity": result[0]})
        else:
            print("No stock found")  # Debugging
            return jsonify({"stock_quantity": None})
    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        print(f"Erreur de base de données (stock): {sqlstate}")
        return jsonify({"error": f"Erreur lors de la récupération du stock: {sqlstate}"}), 500
    finally:
        if conn:
            conn.close()

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Nom d'utilisateur et mot de passe requis"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Vérifier si l'utilisateur existe déjà
        cursor.execute("SELECT id FROM [user] WHERE username = ?", (username,))
        if cursor.fetchone():
            return jsonify({"error": "Utilisateur déjà existant"}), 400

        # Hacher le mot de passe et insérer l'utilisateur
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')  # Utiliser un algorithme plus court
        query = "INSERT INTO [user] (username, password) VALUES (?, ?)"
        print(f"Exécution de la requête : {query} avec username={username}, password={hashed_password}")  # Debug
        cursor.execute(query, (username, hashed_password))
        conn.commit()

        return jsonify({"message": "Inscription réussie"}), 201
    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        print(f"Erreur de base de données (inscription): {sqlstate}, {ex}")  # Ajout du message d'erreur complet
        return jsonify({"error": "Erreur lors de l'inscription"}), 500
    finally:
        if conn:
            conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Nom d'utilisateur et mot de passe requis"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Récupérer l'utilisateur depuis la base de données
        cursor.execute("SELECT password FROM [user] WHERE username = ?", (username,))
        result = cursor.fetchone()
        if not result or not check_password_hash(result[0], password):
            return jsonify({"error": "Identifiants invalides"}), 401

        # Générer un token JWT
        token = jwt.encode(
            {'username': username, 'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)},
            SECRET_KEY
        )
        return jsonify({"token": token}), 200
    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        print(f"Erreur de base de données (connexion): {sqlstate}")
        return jsonify({"error": "Erreur lors de la connexion"}), 500
    finally:
        if conn:
            conn.close()

@app.route('/change-password', methods=['POST'])
@token_required
def change_password():
    data = request.get_json()
    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')

    if not current_password or not new_password:
        return jsonify({"error": "Mot de passe actuel et nouveau mot de passe requis"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Récupérer l'utilisateur depuis le token
        token = request.headers.get('Authorization')
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        username = decoded_token.get('username')

        # Vérifier le mot de passe actuel
        cursor.execute("SELECT password FROM [user] WHERE username = ?", (username,))
        result = cursor.fetchone()
        if not result or not check_password_hash(result[0], current_password):
            return jsonify({"error": "Mot de passe actuel incorrect"}), 401

        # Mettre à jour avec le nouveau mot de passe
        hashed_password = generate_password_hash(new_password, method='pbkdf2:sha256')
        cursor.execute("UPDATE [user] SET password = ? WHERE username = ?", (hashed_password, username))
        conn.commit()

        return jsonify({"message": "Mot de passe changé avec succès"}), 200
    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        print(f"Erreur de base de données (changement de mot de passe): {sqlstate}")
        return jsonify({"error": "Erreur lors du changement de mot de passe"}), 500
    finally:
        if conn:
            conn.close()

@app.route('/recent-predictions', methods=['GET'])
def get_recent_predictions():
    """Retourne les dernières prédictions."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
            SELECT TOP(5)
                ph.prediction_datetime AS date,
                s.LIB AS magasin,
                ph.produit AS ean,
                ph.quantite_predite
            FROM PredictionHistory ph
            JOIN SITE s ON ph.magasin = s.Code_GOLD
            ORDER BY ph.prediction_datetime DESC
        """
        cursor.execute(query)
        predictions = []
        for row in cursor.fetchall():
            predictions.append({
                "date": row.date.strftime('%Y-%m-%d %H:%M:%S') if row.date else None,
                "magasin": row.magasin,
                "ean": row.ean,
                "quantite_predite": row.quantite_predite
            })
        return jsonify(predictions)
    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        print(f"Erreur de base de données (prédictions): {sqlstate}")
        return jsonify({"error": f"Erreur lors de la récupération des prédictions: {sqlstate}"}), 500
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    # Charger les données initiales et entraîner le modèle au démarrage (une seule fois)
    initial_data = load_data_for_prediction()
    if initial_data is not None:
        initial_features, initial_target = preprocess_data(initial_data.copy())
        if initial_features is not None and initial_target is not None and loaded_model is None:
            loaded_model, features_columns = train_model(initial_features, initial_target)

    # Exécuter l'API Flask sur un port spécifique
    app.run(debug=True, port=5000)