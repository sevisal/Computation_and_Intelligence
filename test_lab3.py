import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.datasets import fetch_california_housing
import warnings
warnings.filterwarnings('ignore')

sns.set(style="whitegrid")
# Load California Housing dataset
data = fetch_california_housing(as_frame=True)
df = pd.read_csv('https://raw.githubusercontent.com/ageron/handson-ml/master/datasets/housing/housing.csv')
df = df.dropna()  # Elimina filas con valores faltantes
df = df.drop('ocean_proximity', axis=1)  # Elimina la columna categórica
# df = pd.get_dummies(df, columns=['ocean_proximity'])
N = 1000  # Limit dataset
df = df.sample(n=N, random_state=47).reset_index(drop=True)
df.to_csv("california_housing_data.csv", index=False)

# Define features and target variable
X = df.drop('median_house_value', axis=1)
y = df['median_house_value']

from sklearn.preprocessing import PolynomialFeatures
poly = PolynomialFeatures(degree=3, include_bias=False)
# Generate polynomial features
X_poly = poly.fit_transform(X)
poly_df = pd.DataFrame(X_poly, columns=poly.get_feature_names_out(X.columns))
poly_df['median_house_value'] = y.values
poly_df.to_csv("california_housing_data_poly.csv", index=False)

# Add repeated features to demonstrate overfitting
Num_rep = 5  # Number of times to repeat the first feature
X_red = np.tile(X.iloc[:, 0].values, (Num_rep, 1)).T
X_new = np.hstack([X.values, X_red])
columns_overfit = list(X.columns) + [f"{X.columns[0]}_rep{i+1}" for i in range(Num_rep)]
rep_df = pd.DataFrame(X_new, columns=columns_overfit)
rep_df['median_house_value'] = y.values
rep_df.to_csv("california_housing_data_rep.csv", index=False)

##############################################################
# df = data.frame
# Randomly limit dataset size
# df = df.sample(n=N, random_state=42).reset_index(drop=True)
# Display the first few rows of the dataset
df.head()
# Summary statistics
df.describe()
# Check for missing values
df.isnull().sum()
# Correlation matrix
plt.figure(figsize=(10, 8))
sns.heatmap(df.corr(), annot=True, fmt=".2f", cmap='coolwarm')
plt.title("Correlation Matrix")
plt.show()

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
# Standardize the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
# Linear Regression
lr = LinearRegression()
lr.fit(X_train_scaled, y_train)
y_pred_lr = lr.predict(X_test_scaled)
mse_lr = mean_squared_error(y_test, y_pred_lr)
r2_lr = r2_score(y_test, y_pred_lr)
print(f"Linear Regression - MSE: {mse_lr:.4f}, R2: {r2_lr:.4f}")
# Ridge Regression
ridge = make_pipeline(StandardScaler(), Ridge(alpha=1.0))
ridge.fit(X_train, y_train)
y_pred_ridge = ridge.predict(X_test)
mse_ridge = mean_squared_error(y_test, y_pred_ridge)
r2_ridge = r2_score(y_test, y_pred_ridge)
print(f"Ridge Regression - MSE: {mse_ridge:.4f}, R2: {r2_ridge:.4f}")
# Lasso Regression
lasso = make_pipeline(StandardScaler(), Lasso(alpha=1.))
lasso.fit(X_train, y_train)
y_pred_lasso = lasso.predict(X_test)
mse_lasso = mean_squared_error(y_test, y_pred_lasso)
r2_lasso = r2_score(y_test, y_pred_lasso)
print(f"Lasso Regression - MSE: {mse_lasso:.4f}, R2: {r2_lasso:.4f}")

# Coefficients from Linear Regression
coefficients = pd.DataFrame(lr.coef_, X.columns, columns=['Coefficient'])
print(coefficients)
# Visualize coefficients
plt.figure(figsize=(10, 6))
coefficients.sort_values(by='Coefficient').plot(kind='barh')
plt.title("Feature Coefficients from Linear Regression")
plt.xlabel("Coefficient Value")
plt.ylabel("Features")
plt.show()

# # Save the dataframe to CSV
# df.to_csv("california_housing_data.csv", index=False)

######################################################
# Overfitting by repeating features

X_train_overfit, X_test_overfit, y_train, y_test = train_test_split(X_new, y, test_size=0.3, random_state=42)

# Standardize the features
scaler = StandardScaler()
X_train_overfit = scaler.fit_transform(X_train_overfit)
X_test_overfit = scaler.transform(X_test_overfit)

# Check new shape
print("Overfitted training set shape:", X_train_overfit.shape)
print("Overfitted test set shape:", X_test_overfit.shape)
# Linear Regression on overfitted data
lr_overfit = LinearRegression()
lr_overfit.fit(X_train_overfit, y_train)
y_pred_overfit = lr_overfit.predict(X_test_overfit)
mse_overfit = mean_squared_error(y_test, y_pred_overfit)
r2_overfit = r2_score(y_test, y_pred_overfit)
print(f"Overfitted Linear Regression - MSE: {mse_overfit:.4f}, R2: {r2_overfit:.4f}")
# Ridge Regression on overfitted data
ridge_overfit = make_pipeline(Ridge(alpha=1.0))
ridge_overfit.fit(X_train_overfit, y_train)
y_pred_ridge_overfit = ridge_overfit.predict(X_test_overfit)
mse_ridge_overfit = mean_squared_error(y_test, y_pred_ridge_overfit)
r2_ridge_overfit = r2_score(y_test, y_pred_ridge_overfit)
print(f"Overfitted Ridge Regression - MSE: {mse_ridge_overfit:.4f}, R2: {r2_ridge_overfit:.4f}")
# Lasso Regression on overfitted data
lasso_overfit = make_pipeline(Lasso(alpha=0.005))
lasso_overfit.fit(X_train_overfit, y_train)
y_pred_lasso_overfit = lasso_overfit.predict(X_test_overfit)
mse_lasso_overfit = mean_squared_error(y_test, y_pred_lasso_overfit)
r2_lasso_overfit = r2_score(y_test, y_pred_lasso_overfit)
print(f"Overfitted Lasso Regression - MSE: {mse_lasso_overfit:.4f}, R2: {r2_lasso_overfit:.4f}")

# Coefficients from Overfitted Linear Regression
coefficients_overfit_lr = pd.DataFrame(lr_overfit.coef_, columns_overfit, columns=['Coefficient'])
# Coefficients from Overfitted Ridge Regression
coefficients_overfit_ridge = pd.DataFrame(ridge_overfit.named_steps['ridge'].coef_, columns_overfit, columns=['Coefficient'])
# Coefficients from Overfitted LASSO Regression
coefficients_overfit_lasso = pd.DataFrame(lasso_overfit.named_steps['lasso'].coef_, columns_overfit, columns=['Coefficient'])

# Compare coefficients from original and overfitted models
zeros = np.zeros(Num_rep)
comparison = pd.DataFrame(np.hstack([lr.coef_, zeros]), columns_overfit, columns=['Coefficient'])
comparison['Overfit_LR'] = coefficients_overfit_lr['Coefficient'].values
comparison['Overfit_Ridge'] = coefficients_overfit_ridge['Coefficient'].values
comparison['Overfit_Lasso'] = coefficients_overfit_lasso['Coefficient'].values
print(comparison)

# Visualize comparison
comparison.plot(kind='bar', figsize=(12, 8))
plt.title("Comparison of Coefficients")
plt.xlabel("Features")
plt.ylabel("Coefficient Value")
plt.show()

# # Save the dataframes to CSV files
# X_rep = pd.DataFrame(X_new, columns=columns_overfit)
# X_rep['median_house_value'] = y.values
# X_rep.to_csv("california_housing_data_rep.csv", index=False)

######################################################

from sklearn.preprocessing import PolynomialFeatures

poly = PolynomialFeatures(degree=3, include_bias=False)

# Generate polynomial features
X_poly = poly.fit_transform(X)
X_train_poly, X_test_poly, y_train, y_test = train_test_split(X_poly, y, test_size=0.3, random_state=42)
# Standardize the features
scaler = StandardScaler()
X_train_poly = scaler.fit_transform(X_train_poly)
X_test_poly = scaler.transform(X_test_poly)

print("Polynomial features shape:", X_train_poly.shape)
# Linear Regression on polynomial features
lr_poly = LinearRegression()
lr_poly.fit(X_train_poly, y_train)
y_pred_poly = lr_poly.predict(X_test_poly)
mse_poly = mean_squared_error(y_test, y_pred_poly)
r2_poly = r2_score(y_test, y_pred_poly)
# Ridge Regression on polynomial features
ridge_poly = make_pipeline(Ridge(alpha=100.0))
ridge_poly.fit(X_train_poly, y_train)
y_pred_ridge_poly = ridge_poly.predict(X_test_poly)
mse_ridge_poly = mean_squared_error(y_test, y_pred_ridge_poly)
r2_ridge_poly = r2_score(y_test, y_pred_ridge_poly)
# Lasso Regression on polynomial features
lasso_poly = make_pipeline(Lasso(alpha=0.01))
lasso_poly.fit(X_train_poly, y_train)
y_pred_lasso_poly = lasso_poly.predict(X_test_poly)
mse_lasso_poly = mean_squared_error(y_test, y_pred_lasso_poly)
r2_lasso_poly = r2_score(y_test, y_pred_lasso_poly)

print(f"Polynomial Linear Regression - MSE: {mse_poly:.4f}, R2: {r2_poly:.4f}")
print(f"Polynomial Ridge Regression - MSE: {mse_ridge_poly:.4f}, R2: {r2_ridge_poly:.4f}")
print(f"Polynomial Lasso Regression - MSE: {mse_lasso_poly:.4f}, R2: {r2_lasso_poly:.4f}")
# Coefficients from Polynomial Linear Regression
coefficients_poly = pd.DataFrame(lr_poly.coef_, poly.get_feature_names_out(X.columns), columns=['Coefficient'])
print(coefficients_poly)
# Visualize coefficients
plt.figure(figsize=(12, 8))
plt.barh(coefficients_poly.index, coefficients_poly['Coefficient'])
plt.xlabel("Coefficient Value")
plt.title("Polynomial Regression Coefficients")
plt.show()

# # Save the polynomial features dataframe to CSV
# X_poly_df = pd.DataFrame(X_poly, columns=poly.get_feature_names_out(X.columns))
# X_poly_df['MedHouseVal'] = y.values
# X_poly_df.to_csv("california_housing_data_poly.csv", index=False)