# Pagination

## Description

Ce projet explore différentes techniques de pagination pour des ensembles de données, allant de la pagination simple à des approches plus robustes résistantes aux suppressions.

## Objectifs d'apprentissage

- Paginer un jeu de données avec des paramètres simples `page` et `page_size`
- Paginer un jeu de données avec des métadonnées hypermedia
- Paginer de manière résiliente aux suppressions

---

## 1. Pagination simple avec `page` et `page_size`

La pagination simple consiste à découper un jeu de données en pages de taille fixe. On utilise deux paramètres :

- **`page`** : le numéro de la page souhaitée (commence généralement à `1`)
- **`page_size`** : le nombre d'éléments par page

### Principe

Pour récupérer les éléments d'une page donnée, on calcule l'index de début et de fin dans le jeu de données :

```python
def index_range(page: int, page_size: int) -> tuple:
    start = (page - 1) * page_size
    end = start + page_size
    return (start, end)
```

On extrait ensuite les données correspondantes :

```python
dataset[start:end]
```

### Exemple

Pour `page=2` et `page_size=10` :
- Index de début : `(2 - 1) * 10 = 10`
- Index de fin : `10 + 10 = 20`
- On retourne les éléments de l'index `10` à `19`

---

## 2. Pagination avec métadonnées hypermedia (HATEOAS)

La pagination hypermedia enrichit la réponse avec des informations de navigation. Au lieu de retourner uniquement les données, on retourne un dictionnaire contenant :

| Clé | Description |
|-----|-------------|
| `page_size` | Nombre d'éléments dans la page actuelle |
| `page` | Numéro de la page actuelle |
| `data` | Les données de la page |
| `next_page` | Numéro de la page suivante (`None` si dernière page) |
| `prev_page` | Numéro de la page précédente (`None` si première page) |
| `total_pages` | Nombre total de pages |

### Exemple de réponse

```python
{
    "page_size": 10,
    "page": 2,
    "data": [...],
    "next_page": 3,
    "prev_page": 1,
    "total_pages": 47
}
```

### Avantage

Le client n'a pas besoin de calculer la navigation lui-même : toutes les informations nécessaires sont incluses dans la réponse, ce qui facilite l'intégration et la navigation entre les pages.

---

## 3. Pagination résiliente aux suppressions

La pagination classique basée sur les index peut poser problème si des éléments sont supprimés entre deux requêtes. Par exemple, si la page 3 commence à l'index 20 et qu'un élément de la page 2 est supprimé, le premier élément de la page 3 sera sauté.

### Solution : pagination par index

Au lieu d'utiliser un numéro de page, on utilise un **index dans le jeu de données original**. Chaque réponse inclut l'index du prochain élément à récupérer.

| Clé | Description |
|-----|-------------|
| `index` | Index de départ de la page actuelle |
| `next_index` | Index du prochain élément à récupérer |
| `page_size` | Nombre d'éléments retournés |
| `data` | Les données de la page |

### Principe

On parcourt le jeu de données indexé et on saute les entrées supprimées (valeurs `None`) jusqu'à avoir collecté `page_size` éléments valides.

### Exemple de réponse

```python
{
    "index": 20,
    "next_index": 32,
    "page_size": 10,
    "data": [...]
}
```

### Avantage

Même si des éléments sont supprimés entre deux requêtes, le client peut continuer à paginer sans manquer ni dupliquer d'éléments en utilisant `next_index` comme point de départ pour la requête suivante.

---

## Prérequis

- Python 3.9
- Aucune bibliothèque externe requise

## Auteur

Projet réalisé dans le cadre du cursus **Holberton School**.