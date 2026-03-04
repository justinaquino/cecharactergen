#!/usr/bin/env python3
"""
Build cultures_names.json from names_database.json + surnames_database.json.
Output: flat array of {culture, heritage, type, gender, name} rows.
Spreadsheet-friendly: each row = one name.
"""

import json
import os

# Heritage mapping for all cultures in the dataset
HERITAGE = {
    # European
    "Albanian": "European", "Alsatian": "European", "Anglo-Saxon": "European",
    "Aragonese": "European", "Armenian": "European", "Azerbaijani": "European",
    "Basque": "European", "Belarusian": "European", "Bosnian": "European",
    "Breton": "European", "Bulgarian": "European", "Catalan": "European",
    "Chechen": "European", "Circassian": "European", "Cornish": "European",
    "Corsican": "European", "Croatian": "European", "Czech": "European",
    "Danish": "European", "Dutch": "European", "English": "European",
    "English (British": "European", "Esperanto": "European", "Estonian": "European",
    "Faroese": "European", "Finnish": "European", "Flemish": "European",
    "French": "European", "Frisian": "European", "Galician": "European",
    "Georgian": "European", "German": "European", "Greek": "European",
    "Greenlandic": "European", "Hungarian": "European", "Icelandic": "European",
    "Ingush": "European", "Irish": "European", "Italian": "European",
    "Latvian": "European", "Limburgish": "European", "Lithuanian": "European",
    "Low German": "European", "Macedonian": "European", "Manx": "European",
    "Medieval Czech": "European", "Medieval English": "European",
    "Medieval French": "European", "Medieval German": "European",
    "Medieval Italian": "European", "Medieval Low German": "European",
    "Medieval Occitan": "European", "Medieval Portuguese": "European",
    "Medieval Scottish": "European", "Medieval Spanish": "European",
    "Norman": "European", "Norwegian": "European", "Occitan": "European",
    "Old Church Slavic": "European", "Old Danish": "European",
    "Old Norman": "European", "Picard": "European", "Polish": "European",
    "Portuguese": "European", "Romanian": "European", "Russian": "European",
    "Sami": "European", "Sardinian": "European", "Scandinavian": "European",
    "Scottish": "European", "Serbian": "European", "Slovak": "European",
    "Slovene": "European", "Sorbian": "European", "Spanish": "European",
    "Swedish": "European", "Ukrainian": "European", "Welsh": "European",
    "Yiddish": "European", "Afrikaans": "European", "Dagestani": "European",
    "Ossetian": "European", "Bashkir": "European", "Tatar": "European",

    # Asian
    "Assamese": "Asian", "Balinese": "Asian", "Bengali": "Asian",
    "Bhutanese": "Asian", "Chinese": "Asian", "Filipino": "Asian",
    "Gujarati": "Asian", "Hindi": "Asian", "Hiligaynon": "Asian",
    "Hmong": "Asian", "Indian": "Asian", "Indonesian": "Asian",
    "Japanese": "Asian", "Javanese": "Asian", "Kannada": "Asian",
    "Kazakh": "Asian", "Khmer": "Asian", "Korean": "Asian",
    "Kurdish": "Asian", "Kyrgyz": "Asian", "Malay": "Asian",
    "Malayalam": "Asian", "Marathi": "Asian", "Medieval Mongolian": "Asian",
    "Medieval Turkic": "Asian", "Mongolian": "Asian", "Nepali": "Asian",
    "Odia": "Asian", "Pashto": "Asian", "Persian": "Asian",
    "Punjabi": "Asian", "Sanskrit": "Asian", "Tagalog": "Asian",
    "Tajik": "Asian", "Tamil": "Asian", "Telugu": "Asian",
    "Thai": "Asian", "Tibetan": "Asian", "Turkish": "Asian",
    "Turkmen": "Asian", "Urdu": "Asian", "Uyghur": "Asian",
    "Uzbek": "Asian", "Vietnamese": "Asian", "Iranian": "Asian",
    "Ottoman Turkish": "Asian",

    # African
    "African American": "African", "Akan": "African", "Amharic": "African",
    "Berber": "African", "Chewa": "African", "Eastern African": "African",
    "Ethiopian": "African", "Ewe": "African", "Ganda": "African",
    "Ibibio": "African", "Igbo": "African", "Kikuyu": "African",
    "Luhya": "African", "Luo": "African", "Mwera": "African",
    "Ndebele": "African", "Northern African": "African", "Shona": "African",
    "Sotho": "African", "Southern African": "African", "Swahili": "African",
    "Tswana": "African", "Tumbuka": "African", "Urhobo": "African",
    "Western African": "African", "Xhosa": "African", "Yao": "African",
    "Yoruba": "African", "Zulu": "African", "Coptic": "African",

    # Middle Eastern
    "Ancient Aramaic": "Middle Eastern", "Ancient Egyptian": "Middle Eastern",
    "Ancient Near Eastern": "Middle Eastern", "Ancient Persian": "Middle Eastern",
    "Arabic": "Middle Eastern", "Biblical": "Middle Eastern",
    "Biblical Greek": "Middle Eastern", "Biblical Hebrew": "Middle Eastern",
    "Biblical Latin": "Middle Eastern", "Hebrew": "Middle Eastern",
    "Jewish": "Middle Eastern", "Near Eastern Mythology": "Middle Eastern",
    "Theology": "Middle Eastern",

    # American
    "Algonquin": "American", "American": "American", "Apache": "American",
    "Aymara": "American", "Aztec and Toltec Mythology": "American",
    "Choctaw": "American", "Comanche": "American", "Cree": "American",
    "Incan Mythology": "American", "Inuit": "American", "Iroquois": "American",
    "Mapuche": "American", "Mayan": "American", "Mayan Mythology": "American",
    "Nahuatl": "American", "Native American": "American", "Navajo": "American",
    "New World Mythology": "American", "Nuu-chah-nulth": "American",
    "Ojibwe": "American", "Quechua": "American", "Shawnee": "American",
    "Sioux": "American", "Tupí": "American", "Zapotec": "American",
    "Mormon": "American",

    # Pacific
    "Hawaiian": "Pacific", "Indigenous Australian": "Pacific",
    "Maori": "Pacific", "Polynesian Mythology": "Pacific",
    "Tahitian": "Pacific", "Samoan": "Pacific", "Fijian": "Pacific",

    # Historical / Mythology (keep but tag clearly)
    "Ancient Celtic": "Historical", "Ancient Germanic": "Historical",
    "Ancient Germanic (Latinized": "Historical", "Ancient Greek": "Historical",
    "Ancient Irish": "Historical", "Ancient Roman": "Historical",
    "Ancient Scandinavian": "Historical", "Anglo-Saxon Mythology": "Historical",
    "Armenian Mythology": "Historical", "Arthurian Romance": "Historical",
    "Astronomy": "Historical", "Baltic Mythology": "Historical",
    "Caucasian Mythology": "Historical", "Celtic Mythology": "Historical",
    "Egyptian Mythology": "Historical", "Far Eastern Mythology": "Historical",
    "Finnish Mythology": "Historical", "Folklore": "Historical",
    "Georgian Mythology": "Historical", "Germanic Mythology": "Historical",
    "Greek Mythology": "Historical", "Hinduism": "Historical",
    "History": "Historical", "Irish Mythology": "Historical",
    "Judeo-Christian Legend": "Historical", "Late Greek": "Historical",
    "Late Roman": "Historical", "Literature": "Historical",
    "Medieval Slavic": "Historical", "Modern)": "Historical",
    "Mythology": "Historical", "Norse Mythology": "Historical",
    "Persian Mythology": "Historical", "Popular Culture": "Historical",
    "Roman Mythology": "Historical", "Slavic Mythology": "Historical",
    "Welsh Mythology": "Historical",

    # Additional unmapped
    "Austrian": "European", "Belgian": "European", "Medieval Scandinavian": "European",
    "Slovenian": "European", "Swiss": "European", "Valencian": "European",
    "Afrikaner": "African", "Hausa": "African", "Somali": "African", "Wolof": "African",
    "Cherokee": "American", "Guarani": "American", "Aztec": "American",
    "Inca": "American",
    "Sinhala": "Asian", "Tongan": "Pacific",

    # Misc / Other
    "?)" : "Other", "Pet": "Other", "Rare)": "Other", "Various": "Other",
}

def get_heritage(culture: str) -> str:
    return HERITAGE.get(culture, "Other")

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(script_dir, '..', 'src', 'data')

    with open(os.path.join(data_dir, 'names_database.json'), encoding='utf-8') as f:
        names_db = json.load(f)

    with open(os.path.join(data_dir, 'surnames_database.json'), encoding='utf-8') as f:
        surnames_db = json.load(f)

    rows = []

    # First names
    for culture, genders in names_db['names'].items():
        heritage = get_heritage(culture)
        for gender, name_list in genders.items():
            # gender is 'male', 'female', or 'unisex'
            for name in name_list:
                if name and name.strip():
                    rows.append({
                        "culture": culture,
                        "heritage": heritage,
                        "type": "first",
                        "gender": gender,
                        "name": name.strip()
                    })

    # Surnames
    for culture, name_list in surnames_db['surnames'].items():
        heritage = get_heritage(culture)
        for name in name_list:
            if name and name.strip():
                rows.append({
                    "culture": culture,
                    "heritage": heritage,
                    "type": "surname",
                    "gender": "any",
                    "name": name.strip()
                })

    # Sort: heritage, culture, type, gender, name
    rows.sort(key=lambda r: (r['heritage'], r['culture'], r['type'], r['gender'], r['name']))

    output = {
        "version": "1.0",
        "description": "Culture and name database — one row per name. Columns: culture, heritage, type (first/surname), gender (male/female/unisex/any), name.",
        "columns": ["culture", "heritage", "type", "gender", "name"],
        "stats": {
            "total_rows": len(rows),
            "cultures": len(set(r['culture'] for r in rows)),
            "first_names": sum(1 for r in rows if r['type'] == 'first'),
            "surnames": sum(1 for r in rows if r['type'] == 'surname'),
        },
        "names": rows
    }

    out_path = os.path.join(data_dir, 'cultures_names.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"Written: {out_path}")
    print(f"  Total rows : {output['stats']['total_rows']:,}")
    print(f"  Cultures   : {output['stats']['cultures']}")
    print(f"  First names: {output['stats']['first_names']:,}")
    print(f"  Surnames   : {output['stats']['surnames']:,}")
    unmapped = set(r['culture'] for r in rows if r['heritage'] == 'Other' and r['culture'] not in ('?)', 'Pet', 'Rare)', 'Various'))
    if unmapped:
        print(f"  Unmapped to heritage: {sorted(unmapped)}")

if __name__ == '__main__':
    main()
