# Name Generator Module

## Overview

The Name Generator creates culturally-authentic character names for the Cepheus Engine Character Generator. It uses data from the Behind The Name database combined with cultural surname pools.

## Data Sources

### First Names Database (`names_database.json`)
- **Source**: Behind The Name (behindthename.com)
- **Total Names**: 20,505 names
- **Cultures**: 84+ unique cultures
- **Format**: Organized by culture and gender (male, female, unisex)

### Surnames Database (`surnames_database.json`)
- **Source**: Curated cultural surname lists
- **Coverage**: 100+ cultures
- **Format**: 30+ surnames per culture

## Generation Rules

1. **Parent 1 Culture**: Randomly selected from available cultures
2. **Parent 2 Culture**: 70% chance to match Parent 1, 30% chance to be different
3. **Last Name**: 50/50 chance from either parent's culture
4. **First Name**: 50/50 chance from either parent's culture, filtered by character gender

## API Usage

```python
from src.utils.name_generator import NameGenerator

# Initialize
generator = NameGenerator(
    first_names_path='src/data/names_database.json',
    surnames_path='src/data/surnames_database.json'
)

# Generate a name
name_data = generator.generate_name(gender='male')

# Returns:
# {
#   'full_name': 'Alejandro Fernández',
#   'first_name': 'Alejandro',
#   'last_name': 'Fernández',
#   'parent1_culture': 'Spanish',
#   'parent2_culture': 'Spanish',
#   'first_name_culture': 'Spanish',
#   'surname_culture': 'Spanish',
#   'gender': 'male'
# }

# Get available cultures
cultures = generator.get_available_cultures()

# Get statistics
stats = generator.get_culture_stats()
```

## Cultural Coverage

### Major Cultures (100+ names each)
- English (3,700+ names)
- German (870+ names)
- French (790+ names)
- Italian (700+ names)
- Spanish (800+ names)
- Russian (400+ names)
- Dutch (720+ names)
- Japanese (200+ names)
- Chinese (90+ names)
- Arabic (760+ names)
- Hindi/Indian (200+ names)
- Irish/Scottish (200+ names)

### Regional/Ethnic Cultures
- African: Yoruba, Igbo, Zulu, Xhosa, Amharic, Akan, Hausa, Swahili
- Asian: Korean, Vietnamese, Thai, Indonesian, Malay, Filipino
- European: All major European cultures plus regional (Basque, Breton, Cornish, Welsh, Catalan, Galician, Occitan)
- American Indigenous: Cherokee, Navajo, Sioux, Iroquois, Algonquin, Cree, Ojibwe, Apache, Inuit
- South American: Mayan, Aztec, Inca, Quechua, Aymara, Mapuche, Guarani
- Other: Maori, Hawaiian, Samoan, Fijian, Mongolian, Tibetan, Nepali

## Integration with Character Generator

The Name Generator should be called during character creation after:
1. Species selection
2. Gender selection
3. Background/Homeworld selection (optional - can influence name culture)

The generated name should be displayed in the Character Sheet tile and stored with the character data.

## Future Enhancements

- Nickname generation
- Name meaning display
- Name variant/short form generation
- Royal/noble name prefixes
- Cultural naming conventions (patronymics, matronymics)
