import numpy as np
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis

def calculate():
    covariances = []

    # Задання даних для першого та другого класу
    firstClass = np.array([
        [0.31, 15.5, 1.2, 105],
        [0.52, 12.3, 1.15, 55],
        [0.43, 11.2, 1.18, 75],
        [0.73, 17.7, 1.17, 100],
        [0.94, 16.8, 1.22, 115],
        [0.83, 12.5, 1.16, 85],
        [0.54, 12.2, 1.17, 80]
    ])

    secondClass = np.array([
        [0.25, 15.3, 1.5, 134],
        [0.18, 14.0, 1.8, 93],
        [0.45, 16.8, 1.55, 126],
        [0.18, 18.1, 1.18, 90],
        [0.35, 19.0, 1.35, 139],
        [0.43, 18.2, 1.43, 113],
        [0.29, 14.3, 1.29, 104]
    ])

    # Об'єднання даних у одну матрицю
    X = np.vstack((firstClass, secondClass))

    # Задання міток класів
    y = np.array(["перший", "перший", "перший", "перший", "перший", "перший", "перший",
                  "другий", "другий", "другий", "другий", "другий", "другий", "другий"])

    # Створення та тренування моделі LDA
    lda = LinearDiscriminantAnalysis()
    lda.fit(X, y)

    # Підготовка нових об'єктів для передбачення
    new_objects = np.array([[0.4, 14.23, 1.21, 100], [0.22, 19.02, 1.38, 87]])

    # Передбачення класів для нових об'єктів
    predictions = lda.predict(new_objects)

    # Ймовірності кожного класу для кожного нового об'єкта
    class_probabilities = lda.predict_proba(new_objects)

    # Отримання оцінок коваріаційних матриць для кожного класу
    for class_label in np.unique(y):
        class_indices = np.where(y == class_label)
        class_data = X[class_indices]
        class_covariance = np.cov(class_data, rowvar=False)
        covariances.append(class_covariance)

    # Розрахунок незміщеної оцінки об'єднаної коваріаційної матриці
    n1 = len(firstClass)
    n2 = len(secondClass)
    cov_matrix_group1 = np.cov(firstClass, rowvar=False)
    cov_matrix_group2 = np.cov(secondClass, rowvar=False)
    pooled_covariance = ((n1 - 1) * cov_matrix_group1 + (n2 - 1) * cov_matrix_group2) / (n1 + n2 - 2)

    # Вивід результатів
    print("\nНові об'єкти:\n", new_objects)

    # Вивід класів та їх середніх значень
    class_names = np.unique(y)
    for i, class_label in enumerate(class_names):
        class_mean_values = lda.means_[i]
        class_means_with_labels = np.vstack((firstClass if class_label == "перший" else secondClass, class_mean_values))
        print(f"\nКлас '{class_label}' із середніми значеннями:\n{class_means_with_labels}")

    # Вивід коваріаційних матриць
    for i, class_label in enumerate(class_names):
        print(f"\nКоваріаційна матриця для класу '{class_label}':\n{covariances[i]}")

    # Вивід незміщеної оцінки об'єднаної коваріаційної матриці
    print("\nНезміщена оцінка об'єднаної коваріаційної матриці:\n", pooled_covariance)

    # Вивід деталей моделі LDA
    print("\nМасштабні ваги (оцінки дискримінантних функцій):\n", lda.scalings_)

    # Вивід вектору оцінок коефіцієнтів дискримінантної функції
    print("\nВектор оцінок коефіцієнтів дискримінантної функції:\n", lda.coef_)

    # Вивід дискримінаційної константи
    print("\nДискримінаційна константа:\n", lda.intercept_)

    # Вивід припущень щодо належності до класів
    for i, obj in enumerate(new_objects):
        class_prediction = predictions[i]
        print(f"\nПрипущення щодо належності нового об'єкта Z{i + 1} до класу '{class_prediction}':")

    # Вивід ймовірностей у відсотках
    for i, obj in enumerate(new_objects):
        print(f"\nЙмовірності для нового об'єкта Z{i + 1} у відсотках:")
        probabilities_percent = class_probabilities[i] * 100
        for j, class_label in enumerate(class_names):
            print(f"{class_label}: {probabilities_percent[j]:.2f}%")

    # Повернення результатів передбачень
    return predictions

# Виклик функції та збереження результатів
result = calculate()
