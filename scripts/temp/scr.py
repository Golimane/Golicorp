import json
import requests
import time
from tqdm import tqdm

URL_BASE = 'https://www.minecraft.net/bin/minecraft/productmanagement.productdetails.json?id='
HEADERS = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
SRC_NAME = 'golicontent.json'
DEST_NAME = 'golicontent_local.json'

def fetch_product_data():
    try:
        with open(f'../{SRC_NAME}', 'r') as file:
            content_data = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError, KeyError) as e:
        print(f"Error reading file: {e}")
        return

    results = []

    # Barre de progression avec une SEULE itération
    progress_bar = tqdm(
        content_data,
        desc="Fetching data",
        unit="req",
        bar_format="{l_bar}{bar}| {n_fmt}/{total_fmt} [Time: {elapsed}, ETA: {remaining}]"
    )

    for item in progress_bar:  # <-- Utilisez directement la barre comme itérateur
        product_id = item.get('id')
        # is_main = 'is_main' in item and item.get('is_main')
        # my_part = item.get('my_part')
        # note = item.get('note')
        if not product_id:
            progress_bar.write(f"Missing ID in item: {item}")
            continue
        progress_bar.set_description(f"Fetching ID: {product_id}")

        url = f'{URL_BASE}{product_id}'
        
        try:
            response = requests.get(url, headers=HEADERS)
            response.raise_for_status()
            content = response.json()

            # content['is_main'] = is_main
            # content['my_part'] = my_part
            # content['note'] = note
            
            results.append(content)
            progress_bar.set_postfix({"ID": product_id, "Status": "OK"})
            time.sleep(0.5)
            
        except requests.exceptions.RequestException as e:
            progress_bar.set_postfix({"ID": product_id, "Status": "FAIL"})
            progress_bar.write(f"Failed for ID {product_id}: {str(e)}")
            continue
    
    progress_bar.close()
    print(f"\nCompleted! {len(results)}/{len(content_data)} requests succeeded.")
    
    try:
        with open(f'../{DEST_NAME}', 'w') as output_file:
            json.dump(results, output_file, indent=4)
        print(f'File {DEST_NAME} saved successfully.')
    except IOError as e:
        print(f"Error writing file: {e}")

if __name__ == "__main__":
    fetch_product_data()

input('Tape ENTER to close...')