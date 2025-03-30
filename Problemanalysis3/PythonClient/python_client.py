import requests
import random

#For  base URL of the API 
API_URL = "https://localhost:7177/api/quotes"

# It is a function to load sample quotes into the database
def load_quotes():
    sample_quotes = [
        {"content": "Life is 10% what happens to us and 90% how we react to it.", "author": "Charles R. Swindoll"},
        {"content": "The only limit to our realization of tomorrow is our doubts of today.", "author": "Franklin D. Roosevelt"},
        {"content": "It does not matter how slowly you go as long as you do not stop.", "author": "Confucius"},
        {"content": "The best way to predict the future is to create it.", "author": "Peter Drucker"}
    ]
    
    for quote in sample_quotes:
        response = requests.post(API_URL, json=quote, verify=False)  
        if response.status_code == 201:
            print(f"Added: {quote['content']}")
        else:
            print("Failed to add quote:", response.json())

# For  adding a new quote
def add_quote():
    content = input("Enter the quote: ")
    author = input("Enter the author (leave blank if unknown): ") or None
    response = requests.post(API_URL, json={"content": content, "author": author}, verify=False)
    if response.status_code == 201:
        print("Quote added successfully!")
    else:
        print("Error adding quote:", response.json())

# For getting all quotes
def get_quotes():
    response = requests.get(API_URL, verify=False)
    if response.status_code == 200:
        quotes_data = response.json()
        
        # For checking if API response contains values key
        if "$values" in quotes_data:
            quotes = quotes_data["$values"]
        else:
            quotes = quotes_data  
        
        if not quotes:
            print("No quotes found.")
            return
        
        for q in quotes:
            print(f"{q['id']}: \"{q['content']}\" - {q.get('author', 'Unknown')} (Likes: {q['likes']})")
    else:
        print("Failed to fetch quotes", response.status_code)

# For  getting a random quote
def get_random_quote():
    response = requests.get(API_URL, verify=False)
    if response.status_code == 200:
        quotes_data = response.json()
        
        if "$values" in quotes_data:
            quotes = quotes_data["$values"]
        else:
            quotes = quotes_data
        
        if quotes:
            quote = random.choice(quotes)
            print(f"Random Quote: \"{quote['content']}\" - {quote.get('author', 'Unknown')}")
        else:
            print("No quotes available.")
    else:
        print("Failed to fetch quotes")

#To like a quote
def like_quote():
    quote_id = input("Enter Quote ID to like: ")
    response = requests.post(f"{API_URL}/{quote_id}/like", verify=False)
    if response.status_code == 200:
        print("Quote liked successfully!")
    else:
        print("Error liking quote:", response.json())

# This is for Client Menu 
def main():
    while True:
        print("\n1. Load Sample Quotes")
        print("2. Add a New Quote")
        print("3. Get All Quotes")
        print("4. Get a Random Quote")
        print("5. Like a Quote")
        print("6. Exit")

        choice = input("Choose an option: ")
        if choice == "1":
            load_quotes()
        elif choice == "2":
            add_quote()
        elif choice == "3":
            get_quotes()
        elif choice == "4":
            get_random_quote()
        elif choice == "5":
            like_quote()
        elif choice == "6":
            break
        else:
            print("Invalid choice, please try again.")

if __name__ == "__main__":
    main()
