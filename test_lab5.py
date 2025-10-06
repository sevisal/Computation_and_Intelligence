import pandas as pd
import numpy as np
from PIL import Image
import os

# Load flattened data
df = pd.read_csv("fashion-mnist_train.csv")

# Identify label and pixel columns
labels = df["label"] if "label" in df.columns else None
pixels = df.drop(columns=["label"], errors="ignore").values

# Run stratified sampling to partition the data
from sklearn.model_selection import train_test_split
pixels, _, labels, _ = train_test_split(pixels, labels, test_size=0.95, stratify=labels, random_state=42)
print(f"Sampled {len(pixels)} images.")

# Save reduced dataset
reduced_df = pd.DataFrame(pixels)
if labels is not None:
    reduced_df["label"] = labels.values
reduced_df.to_csv("fashion-mnist_reduced.csv", index=False)