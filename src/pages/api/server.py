from flask import Flask, jsonify, request
from flask_cors import CORS
import pyodbc

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Database connection
conn = pyodbc.connect(r'DRIVER={SQL Server};'
                      r'SERVER=X75VC\SQLEXPRESS;'
                      r'DATABASE=GestionOS;'
                      r'Trusted_Connection=yes;')

@app.route('/stores', methods=['GET'])
def get_stores():
    cursor = conn.cursor()
    cursor.execute("SELECT Id, code_gold, LIB FROM Site")  # Include Id for later use
    stores = [{"value": row.Id, "label": f"{row.code_gold} : {row.LIB}"} for row in cursor.fetchall()]
    return jsonify(stores)

def get_db_connection():
    return pyodbc.connect(r'DRIVER={SQL Server};'
                          r'SERVER=X75VC\SQLEXPRESS;'
                          r'DATABASE=GestionOS;'
                          r'Trusted_Connection=yes;')

@app.route('/products', methods=['GET'])
def get_products():
    conn = get_db_connection()  # Create a new connection
    cursor = conn.cursor()
    cursor.execute("SELECT Id, EAN, Produit FROM os_detail")
    products = [{"value": row.Id, "label": f"{row.EAN} : {row.Produit}"} for row in cursor.fetchall()]
    conn.close()  # Close the connection after query execution
    return jsonify(products) 


@app.route('/stock', methods=['GET'])
def get_stock():
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

    cursor = conn.cursor()
    cursor.execute("""
        SELECT Stock_Actuel
        FROM OS_ENGAGEMENT eng
        JOIN SITE S ON eng.Site_ID = S.Id
        JOIN OS_DETAIL det ON eng.OS_DETAIL_ID = det.Id
        WHERE eng.OS_DETAIL_ID = ? AND eng.Site_ID = ?
    """, (product_id, store_id))
    result = cursor.fetchone()

    if result:
        print(f"Stock found: {result[0]}")  # Debugging
        return jsonify({"stock_quantity": result[0]})
    else:
        print("No stock found")  # Debugging
        return jsonify({"stock_quantity": None})

if __name__ == '__main__':
    app.run(debug=True)