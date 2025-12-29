import pandas as pd
import mysql.connector
from mysql.connector import Error
import os

# ---------- MYSQL CONNECTION ----------
def create_connection():
    print("🔄 Trying to connect to MySQL (TCP forced)...")

    try:
        conn = mysql.connector.connect(
            host="127.0.0.1",              # ✅ force TCP
            user="root",
            password="Harini@2005",
            database="trump_tariff_db",
            port=3306,
            auth_plugin="mysql_native_password",
            use_pure=True,                 # ✅ disable C-extension
            connection_timeout=5
        )

        if conn.is_connected():
            print("✅ Connected to MySQL successfully")

        return conn

    except Error as e:
        print("❌ MySQL Connection Error:", e)
        return None


# ---------- INSERT DATA ----------
def insert_excel_to_mysql(excel_path, table_name, conn):
    print(f"\n📂 Processing file: {excel_path}")

    if not os.path.exists(excel_path):
        print(f"❌ File not found: {excel_path}")
        return

    try:
        df = pd.read_excel(excel_path)
        print(f"✅ Excel loaded ({len(df)} rows)")

        # Fix column names
        df.columns = [
            f"col_{i}" if str(col) == "nan"
            else str(col).strip().replace(" ", "_").replace("-", "_")
            for i, col in enumerate(df.columns)
        ]

        cursor = conn.cursor()

        # Create table
        columns = ", ".join([f"`{col}` TEXT" for col in df.columns])
        cursor.execute(f"CREATE TABLE IF NOT EXISTS `{table_name}` ({columns});")
        print(f"✅ Table `{table_name}` ready")

        # Replace NaN values
        df = df.fillna("")

        # Insert rows
        for _, row in df.iterrows():
            placeholders = ", ".join(["%s"] * len(row))
            cursor.execute(
                f"INSERT INTO `{table_name}` VALUES ({placeholders})",
                tuple(row)
            )

        conn.commit()
        print(f"✅ Inserted {len(df)} rows into `{table_name}`")

    except Exception as e:
        print("❌ Error while inserting data:", e)


# ---------- MAIN ----------
print("\n🚀 Script started\n")

conn = create_connection()

if conn:
    base_path = r"C:\Users\USER\OneDrive\Desktop\impact analyser"

    insert_excel_to_mysql(
        os.path.join(base_path, "currency.xlsx"),
        "currency_table",
        conn
    )

    insert_excel_to_mysql(
        os.path.join(base_path, "duty type.xlsx"),
        "duty_type_table",
        conn
    )

    insert_excel_to_mysql(
        os.path.join(base_path, "tariff_dataset_500_rows.xlsx"),
        "tariff_table",
        conn
    )

    conn.close()
    print("\n🎉 All Excel files inserted successfully into trump_tariff_db")

else:
    print("❌ Database connection failed. Script stopped.")
