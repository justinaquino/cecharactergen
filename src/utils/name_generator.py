import json
import random
from typing import Dict, List, Tuple, Optional

class NameGenerator:
    """
    Cultural name generator for Cepheus Engine Character Generator.
    
    Rules:
    1. Roll for first parent's culture
    2. Second parent's culture is 70% likely to match first parent
    3. Last name is randomly selected from parent cultures' surname pools
    4. First name is based on gender and randomly selected from either parent's culture
    """
    
    def __init__(self, first_names_path: str, surnames_path: str):
        """
        Initialize the name generator with name databases.
        
        Args:
            first_names_path: Path to first names database JSON
            surnames_path: Path to surnames database JSON
        """
        # Load first names database
        with open(first_names_path, 'r', encoding='utf-8') as f:
            first_data = json.load(f)
            self.cultures = first_data['cultures']
            self.names_by_culture = first_data['names']
        
        # Load surnames database
        with open(surnames_path, 'r', encoding='utf-8') as f:
            surname_data = json.load(f)
            self.surnames_by_culture = surname_data['surnames']
        
        # Filter to only cultures that have both first names AND surnames
        self.available_cultures = [
            cult for cult in self.cultures 
            if cult in self.surnames_by_culture and 
            (self.names_by_culture.get(cult, {}).get('male') or 
             self.names_by_culture.get(cult, {}).get('female') or
             self.names_by_culture.get(cult, {}).get('unisex'))
        ]
        
    def select_parent_cultures(self) -> Tuple[str, str]:
        """
        Select cultures for both parents.
        Parent 1: Randomly selected from available cultures
        Parent 2: 70% chance to match Parent 1, 30% chance to be different
        
        Returns:
            Tuple of (parent1_culture, parent2_culture)
        """
        # Select parent 1 culture randomly
        parent1_culture = random.choice(self.available_cultures)
        
        # Parent 2 has 70% chance to match parent 1
        if random.random() < 0.7:
            parent2_culture = parent1_culture
        else:
            # 30% chance: select a different culture
            remaining_cultures = [c for c in self.available_cultures if c != parent1_culture]
            parent2_culture = random.choice(remaining_cultures)
        
        return parent1_culture, parent2_culture
    
    def select_last_name(self, parent1_culture: str, parent2_culture: str) -> Tuple[str, str]:
        """
        Select a last name from either parent's culture.
        Each parent culture has equal chance of providing the surname.
        
        Args:
            parent1_culture: Culture of parent 1
            parent2_culture: Culture of parent 2
            
        Returns:
            Tuple of (surname, culture_of_origin)
        """
        # 50/50 chance which parent's culture provides the surname
        if random.random() < 0.5:
            surname_culture = parent1_culture
        else:
            surname_culture = parent2_culture
        
        surnames = self.surnames_by_culture.get(surname_culture, [])
        if not surnames:
            # Fallback to English if culture has no surnames
            surnames = self.surnames_by_culture.get('English', ['Smith'])
            surname_culture = 'English'
        
        surname = random.choice(surnames)
        return surname, surname_culture
    
    def select_first_name(self, gender: str, parent1_culture: str, parent2_culture: str) -> Tuple[str, str]:
        """
        Select a first name based on gender and parent cultures.
        Can come from either parent's culture (equal chance).
        
        Args:
            gender: 'male', 'female', or 'unisex'
            parent1_culture: Culture of parent 1
            parent2_culture: Culture of parent 2
            
        Returns:
            Tuple of (first_name, culture_of_origin)
        """
        # Normalize gender
        if gender.lower() in ['m', 'male']:
            gender_key = 'male'
        elif gender.lower() in ['f', 'female']:
            gender_key = 'female'
        else:
            gender_key = 'unisex'
        
        # 50/50 chance which parent's culture provides the first name
        if random.random() < 0.5:
            name_culture = parent1_culture
        else:
            name_culture = parent2_culture
        
        # Get names for this culture and gender
        culture_names = self.names_by_culture.get(name_culture, {})
        names = culture_names.get(gender_key, [])
        
        # If no names of that gender, try unisex, then try other gender
        if not names:
            names = culture_names.get('unisex', [])
        if not names:
            other_gender = 'female' if gender_key == 'male' else 'male'
            names = culture_names.get(other_gender, [])
        
        # If still no names, fallback to English
        if not names:
            name_culture = 'English'
            english_names = self.names_by_culture.get('English', {})
            names = english_names.get(gender_key, english_names.get('unisex', ['Unknown']))
        
        first_name = random.choice(names)
        return first_name, name_culture
    
    def generate_name(self, gender: str = 'male') -> Dict:
        """
        Generate a complete character name with cultural background.
        
        Args:
            gender: 'male', 'female', or 'unisex' (default: 'male')
            
        Returns:
            Dictionary containing:
            - full_name: Complete name
            - first_name: First name
            - last_name: Surname
            - parent1_culture: Culture of first parent
            - parent2_culture: Culture of second parent
            - first_name_culture: Culture first name came from
            - surname_culture: Culture surname came from
            - gender: Character gender
        """
        # Select parent cultures
        parent1_culture, parent2_culture = self.select_parent_cultures()
        
        # Select last name
        last_name, surname_culture = self.select_last_name(parent1_culture, parent2_culture)
        
        # Select first name
        first_name, first_name_culture = self.select_first_name(gender, parent1_culture, parent2_culture)
        
        # Combine into full name
        full_name = f"{first_name} {last_name}"
        
        return {
            'full_name': full_name,
            'first_name': first_name,
            'last_name': last_name,
            'parent1_culture': parent1_culture,
            'parent2_culture': parent2_culture,
            'first_name_culture': first_name_culture,
            'surname_culture': surname_culture,
            'gender': gender
        }
    
    def get_available_cultures(self) -> List[str]:
        """Return list of available cultures for name generation."""
        return self.available_cultures.copy()
    
    def get_culture_stats(self) -> Dict:
        """Return statistics about available cultures."""
        stats = {}
        for cult in self.available_cultures:
            first_names = self.names_by_culture.get(cult, {})
            surnames = self.surnames_by_culture.get(cult, [])
            stats[cult] = {
                'male_names': len(first_names.get('male', [])),
                'female_names': len(first_names.get('female', [])),
                'unisex_names': len(first_names.get('unisex', [])),
                'surnames': len(surnames)
            }
        return stats


# Example usage and testing
if __name__ == "__main__":
    import os
    
    # Get paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    first_names_path = os.path.join(base_dir, 'data', 'names_database.json')
    surnames_path = os.path.join(base_dir, 'data', 'surnames_database.json')
    
    # Initialize generator
    generator = NameGenerator(first_names_path, surnames_path)
    
    # Print stats
    print("=" * 60)
    print("NAME GENERATOR - AVAILABLE CULTURES")
    print("=" * 60)
    stats = generator.get_culture_stats()
    for cult, stat in sorted(stats.items()):
        print(f"\n{cult}:")
        print(f"  Male: {stat['male_names']}, Female: {stat['female_names']}, Unisex: {stat['unisex_names']}")
        print(f"  Surnames: {stat['surnames']}")
    
    print("\n" + "=" * 60)
    print("SAMPLE CHARACTER NAMES")
    print("=" * 60)
    
    # Generate sample names
    for gender in ['male', 'female']:
        print(f"\n--- {gender.upper()} CHARACTERS ---")
        for i in range(5):
            name_data = generator.generate_name(gender)
            print(f"\n{i+1}. {name_data['full_name']}")
            print(f"   Parents: {name_data['parent1_culture']} + {name_data['parent2_culture']}")
            print(f"   First name from: {name_data['first_name_culture']}")
            print(f"   Surname from: {name_data['surname_culture']}")
