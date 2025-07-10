import pandas as pd
from sklearn.preprocessing import LabelEncoder, MultiLabelBinarizer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.multioutput import MultiOutputClassifier
import joblib
import os

# Create directory for saving label encoders
os.makedirs("label_encoders_rf", exist_ok=True)

# Sample data for training (since we don't have the actual dataset)
data = {
    'Language_Proficiency': ['Uses simple words and phrases', 'Communicates clearly for their age', 'Uses advanced vocabulary', 'Rarely speaks or responds'],
    'Communication_Skills': ['Occasionally', 'Frequently', 'Never'],
    'Diagnosis': ['Autism Spectrum Disorder (ASD)', 'ADHD', 'Speech or Language Disorder', 'No formal diagnosis / Not sure'],
    'Severity': ['Mild – minimal support required', 'Moderate – regular assistance required', 'Severe – continuous supervision needed'],
    'Medical_Conditions': ['Yes', 'No', 'Under Evaluation'],
    'Independence_Level': ['Yes', 'Partially', 'No'],
    'Learning_Speed': ['With significant difficulty', 'With repeated practice', 'With some support', 'Quickly and independently'],
    'Learning_Style': ['Visual (images, videos)', 'Auditory (spoken instructions, music)', 'Kinesthetic (hands-on activities)', 'Not sure yet'],
    'Memory_Retention': ['Often forgets and needs to relearn', 'Retains with reminders or review', 'Applies without difficulty'],
    'Skill_Application': ['No', 'Sometimes', 'Often'],
    'Preferred_Activities': ['Drawing or coloring', 'Listening to music or singing', 'Playing games or puzzles', 'Watching videos or cartoons'],
    'Attention_Span': ['Less than 10 minutes', '10–30 minutes', 'More than 30 minutes'],
    'Social_Interaction': ['Alone', 'With a parent/guardian', 'In a group setting'],
    'Age_Group': ['2–4 years', '5–7 years', '8–10 years', '11–13 years', '14 years or older'],
    'Education_Level': ['Not in school yet', 'Preschool / Kindergarten', 'Primary School (1st–5th)', 'Middle School (6th–8th)', 'High School (9th+)']
}

# Create a sample dataset
n_samples = 1000
df = pd.DataFrame({
    col: pd.Series(pd.np.random.choice(values, n_samples))
    for col, values in data.items()
})

# Add target variable (recommended pathways)
pathways = [
    'Adaptive Self-Care Training',
    'Attention & Behavioral Focus Training',
    'Auditory Learning Sessions',
    'Developmental Support Program',
    'Expressive Practice Sessions',
    'Generalization Practice',
    'Guided Learning Support',
    'Intensive Intervention Program',
    'Social Communication Intervention',
    'Speech Therapy'
]

# Generate random pathway combinations
df['Recommended Pathways'] = [
    '; '.join(pd.np.random.choice(pathways, size=pd.np.random.randint(2, 5), replace=False))
    for _ in range(n_samples)
]

# Split input and output
X_raw = df.drop(columns=["Recommended Pathways"])
y_raw = df["Recommended Pathways"]

# Label encode inputs and save encoders
label_encoders = {}
X_encoded = pd.DataFrame()

for col in X_raw.columns:
    le = LabelEncoder()
    X_encoded[col] = le.fit_transform(X_raw[col])
    label_encoders[col] = le
    joblib.dump(le, f"label_encoders_rf/{col}_encoder.pkl")

# MultiLabel Binarize output
mlb = MultiLabelBinarizer()
y_encoded = mlb.fit_transform(y_raw.str.split("; "))
joblib.dump(mlb, "label_encoders_rf/target_mlb.pkl")

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X_encoded, y_encoded, test_size=0.2, random_state=42)

# Print feature information
print("\nFeature Information:")
print("Number of features:", len(X_encoded.columns))
print("Feature names:", list(X_encoded.columns))

# Train model
rf = MultiOutputClassifier(RandomForestClassifier(n_estimators=100, random_state=42))
rf.fit(X_train, y_train)

# Save the trained model
joblib.dump(rf, "rf_multilabel_model.pkl")

print("\nModel and encoders saved successfully!") 