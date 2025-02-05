# import requests # To make HTTP requests
# import pandas as pd
# import time
# import random  # To introduce randomness
# from concurrent.futures import ThreadPoolExecutor
# from dotenv import load_dotenv
# import os

# load_dotenv()
#

# # Fetch users globally with filters
# def fetch_global_users(query, page):
#     url = f""
#     while True:
#         response = requests.get(url, headers=HEADERS)
#         if response.status_code == 200:
#             return response.json().get('items', [])
#         elif response.status_code == 403:
#             print(f"Rate limit hit. Retrying after delay...")
#             handle_rate_limit(response)
#         else:
#             print(f"Error fetching users: {response.json()}")
#             return []

# # Fetch user repositories
# def fetch_user_repos(username):
#     url = f""
#     while True:
#         response = requests.get(url, headers=HEADERS)
#         if response.status_code == 200:
#             return response.json()
#         elif response.status_code == 403:
#             print(f"Rate limit hit for repos. Retrying after delay...")
#             handle_rate_limit(response)
#         else:
#             return []

# # Handle rate limit
# def handle_rate_limit(response):
#     retry_after = response.headers.get("Retry-After")
#     reset_time = response.headers.get("X-RateLimit-Reset")

#     if retry_after:
#         sleep_time = int(retry_after)
#     elif reset_time:
#         sleep_time = max(1, int(reset_time) - int(time.time()))
#     else:
#         sleep_time = 60  # Default wait time if headers are unavailable

#     print(f"Sleeping for {sleep_time} seconds...")
#     time.sleep(sleep_time)

# # Fetch detailed user data
# def fetch_user_data(user):
#     username = user['login']
#     user_details_url = f"https://api.github.com/users/{username}"
#     while True:
#         user_details = requests.get(user_details_url, headers=HEADERS)
#         if user_details.status_code == 200:
#             user_details = user_details.json()
#             break
#         elif user_details.status_code == 403:
#             print(f"Rate limit hit for user {username}. Retrying after delay...")
#             handle_rate_limit(user_details)
#         else:
#             return {}

#     repos = fetch_user_repos(username)
#     languages = [repo['language'] for repo in repos if repo['language']]
#     language_counts = {lang: languages.count(lang) for lang in set(languages)}

#     total_stars = sum(repo.get('stargazers_count', 0) for repo in repos)
#     total_forks = sum(repo.get('forks_count', 0) for repo in repos)

#     # Extract location as Country (fallback to "Unknown" if not available)
#     country = user_details.get('location', 'Unknown')

#     # Additional repository data
#     forked_repos_count = sum(1 for repo in repos if repo.get('fork', False))
#     last_activity_date = max((repo.get('updated_at', 'N/A') for repo in repos), default="N/A")
#     repo_topics = [repo.get('topics', []) for repo in repos]
#     total_topics = set(topic for topics in repo_topics for topic in topics)
#     repo_sizes = sum(repo.get('size', 0) for repo in repos)

#     # Other user details
#     public_email = user_details.get('email', 'N/A')
#     hireable = user_details.get('hireable', False)

#     return {
#         "Username": username,
#         "Profile URL": user['html_url'],
#         "Country": country,
#         "Repositories Count": len(repos),
#         "Followers": user_details.get('followers', 0),
#         "Following": user_details.get('following', 0),
#         "Top Languages": ", ".join(language_counts.keys()),
#         "Most Used Language": max(language_counts, key=language_counts.get) if language_counts else "None",
#         "Total Stars": total_stars,
#         "Total Forks": total_forks,
#         "Public Gists": user_details.get('public_gists', 0),
#         "Account Created At": user_details.get('created_at', 'N/A'),
#         "Bio": user_details.get('bio', 'N/A'),
#         "Public Email": public_email,
#         "Hireable": hireable,
#         "Forked Repositories": forked_repos_count,
#         "Last Activity Date": last_activity_date,
#         "Unique Topics": ", ".join(total_topics),
#         "Total Repository Size (KB)": repo_sizes,
#     }

# # Main function
# def main():
#     queries = ["type:user+created:<2015-01-01", "type:user+created:2015-01-01..2018-01-01", "type:user+created:2018-01-01..2021-01-01", "type:user+created:>2021-01-01"]
#     all_users = []

#     random.shuffle(queries)  # Shuffle the queries to randomize which ones are run first

#     for query in queries:
#         pages = list(range(1, 11))  # Fetch pages from 1 to 10
#         random.shuffle(pages)  # Shuffle pages to randomize the page fetching order
#         for page in pages:
#             users = fetch_global_users(query, page)
#             if not users:
#                 break
#             all_users.extend(users)
#             print(f"Fetched page {page} for query '{query}', total users: {len(all_users)}")
#             time.sleep(random.randint(1, 3))  # Random sleep between 1-3 seconds to avoid hitting rate limits

#     print(f"Total users fetched: {len(all_users)}")

#     # Shuffle the user list for randomness
#     random.shuffle(all_users)

#     user_data = []
#     with ThreadPoolExecutor(max_workers=10) as executor:
#         results = list(executor.map(fetch_user_data, all_users))
#         user_data.extend(results)

#     # Save to CSV
#     df = pd.DataFrame(user_data)
#     df.to_csv("global_random_github_users_with_country3.csv", index=False)
#     print("Data saved to global_random_github_users_with_country3.csv")

# if __name__ == "__main__":
#     main()
