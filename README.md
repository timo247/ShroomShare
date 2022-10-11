# ShroomShare

REST API allowing users to localize where they can gather mushrooms.
The users go into the wild in search for mushrooms. Once they find mushrooms, they picture them and describe them. They then can create a gathering place, which is a physical place containing wild mushrooms.
The other users of the app can then go to the gathering place and confirm whether or not they found mushrooms. Any user can create a gathering place, which is physically in a radius of 1km of where the picture has been taken.

# Table of Contents

- [ShroomShare](#shroomshare)
- [Table of Contents](#table-of-contents)
- [Routes](#routes)
    - [Espèces (de champignons)](#espèces-de-champignons)
        - [Ajouter une espèce](#ajouter-une-espèce)
        - [Modifier une espèce](#modifier-une-espèce)
        - [Supprimer une espèce](#supprimer-une-espèce)
        - [Retrouver toutes les espèces](#retrouver-toutes-les-espèces)
        - [Retrouver une espèce](#retrouver-une-espèce)
    - [Champignons](#champignons)
        - [Ajouter un champignon](#ajouter-un-champignon)
        - [Supprimer un champignon](#supprimer-un-champignon)
        - [Modifier un champignon](#modifier-un-champignon)
        - [Retrouver des champignons](#retrouver-des-champignons)
    - [Utilisateurs](#utilisateurs)
        - [Retrouver tous les utilisateurs](#retrouver-tous-les-utilisateurs)
        - [Retrouver un utilisateur](#retrouver-un-utilisateur)
        - [Créer un utilisateur](#créer-un-utilisateur)
        - [Modifier un utilisateur](#modifier-un-utilisateur)
        - [Supprimer un utilisateur](#supprimer-un-utilisateur)
    - [Schémas](#schémas)

# Routes 

__Legendes__

- `🔐`: route accesible uniquement aux __administrateurs__
- `🔒`: route accesible uniquement aux __utilisateurs/administrateurs__

## Espèces (de champignons) 

### Ajouter une espèce

	🔐 POST api/species 
    
__Corps de la reqûete__

```
{ 
    name: String, 
    description: String, 
    weight: number, 
    usage: String, 
    picture: File<JPG|PNG>, 
} 
```

__Réponse 201__

```json
{
    "message": "Specy created",
    "specy": {
        "name": "Amanita phalloides", 
        "description": "The Amanita phalloides is a ...", 
        "weight": "0.05", 
        "usage": "edible", 
        "picture": "https://..." 
    }
} 
```

### Modifier une espèce 

	🔐 PATCH api/species/:id 
    
__Corps de la reqûete__

```
{ 
    name?: String, 
    description?: String, 
    weight?: Number, 
    usage?: String, 
    picture?: File<JPG|PNG>, 
} 
```

__Réponse 200__

```json
{
    "message": "Specy modified",
    "specy": {
        "name": "Amanita phalloides", 
        "description": "The Amanita phalloides is a ...", 
        "weight": "0.05", 
        "usage": "edible", 
        "picture": "https://..." 
    }
} 
```

### Supprimer une espèce 

	🔐 DELETE api/species/:id 

__Réponse  200__

```json
{ 
    "message": "Specy deleted" 
} 
```

### Retrouver toutes les espèces 

	🔒 GET api/species 

__Réponse 200__

```json
{ 
    "message": "Species succefully retrieved",
    "species": [ 
        { 
            "name": "Amanita phalloides", 
            "description": "The Amanita phalloides is a ...", 
            "usage": "edible", 
            "picture": "https://..." 
        } 
    ] 
} 
```

### Retrouver une espèce 

	🔒 GET api/species/:id 

__Réponse 200__

```json
{ 
    "message": "Species succefully retrieved",
    "specy": { 
        "name": "Amanita phalloides", 
        "description": "The Amanita phalloides is a ...", 
        "usage": "edible", 
        "picture": "https://..." 
    } 
} 
```

## Champignons 

### Ajouter un champignon 

	🔒 POST api/mushrooms 
    
__Corps de la requête__

```
{ 
    specy_id: Number, 
    user_id: Number, 
    picture: File<JPG|PNG>, 
    description?: String, 
    date: Date, 
    location: { 
        lat: String, 
        long: String, 
    } 
} 
```

__Réponse 200__

```json
{ 
    "message": "Mushroom added",
    "specy": {
        "sepcy_id": "1", 
        "user_id": "1", 
        "picture": "https://...", 
        "description": "This is a Amanita phalloides...", 
        "date": "2022.01.01", 
        "location": { 
            "lat": "...", 
            "long": "..." 
        } 
    }
} 
```

### Supprimer un champignon 

	🔒 DELETE api/mushrooms/:id 

__Réponse: 200__

```json
{ 
    "message": "Mushroom deleted",
} 
```

### Modifier un champignon 

	🔒 PATCH api/mushrooms/:id 
    
__Corps de la requête__

```
{ 
    specy_id?: Number, 
    user_id?: Number, 
    picture?: File<JPG|PNG>, 
    description?: String, 
    date?: Date, 
    location?: { 
        lat: Number, 
        long: Number 
    } 
} 
```

__Réponse: 200__

```json
{ 
    "message": "Mushroom updated",
    "specy": {
        "sepcy_id": "1", 
        "picture": "https://...", 
        "description": "This is a Amanita phalloides...", 
        "date": "2022.01.01", 
        "location": { 
            "lat": "...", 
            "long": "...", 
        } 
    }
} 
```

### Retrouver des champignons 

	🔒 GET api/mushrooms 

__Filtres disponibles__

- `?location={ lat:Float, long:Float }`: Coordonnées GPS 
- `?spieces=String`: Espèce(s) 
- `?user=Integer`: ID Utilisateur 
- `&total=Boolean`: Somme des champignons par utilisateur (Si TRUE) 
- `?usage=String`: Usage 
- `?from=Date`: Date de début 
- `?to=Date`: Date de Fin 
- `?page=value`: Numéro de la page 
- `?pageSize`: Nombre d’éléments par page 

__Réponse: 200__

```json
{ 
    "message": "Mushrooms retrieved",
    "species": [
        { 
            "sepcy_id": "1", 
            "picture": "https://...", 
            "description": "This is a Amanita phalloides...", 
            "date": "2022.01.01", 
            "location": { 
                "lat": "...", 
                "long": "...", 
            }
        }
    ] 
} 
```

## Utilisateurs 

### Retrouver tous les utilisateurs 

	🔒 GET api/users 
    
__Filtres__

- `?page=value`: Numéro de la page 
- `?pageSize`: Nombre d’éléments par page 

__Réponse: 200__

```json
{ 
    "message": "Users retrieved",
	"users": [
        { 
            "username": "John2022", 
            "admin": "false", 
        }
    ] 
} 
```

### Retrouver un utilisateur 

	🔒 GET api/users/:id 

__Réponse: 200__

```json
{ 
    "message": "User retrieved",
    "user": {
        "username": "John2023", 
        "admin": "false", 
    }
} 
```

### Créer un utilisateur 

	POST api/users 

```
{ 
    username: String, 
    password: String, 
    email: String,  
    admin: Boolean, 
} 
```

__Réponse 2001__

```json
{ 
    "message": "User created",
    "user": {
        "username": "John2023", 
        "password": "mySecretPassword", 
        "Email": "john.doe@gmail.com",  
        "admin": "false", 
    }
} 
```

### Modifier un utilisateur 

	🔒 PATCH api/users/:id 

__Corps de la requête__

```
{ 
    username?: String, 
    password?: String, 
    email?: String,  
    admin?: Boolean, 
} 
```

__Réponse: 200__

```json
{ 
    "message": "User modified",
    "user": {
        "username": "John2023", 
        "password": "mySecretPassword", 
        "Email": "john.doe@gmail.com",  
        "admin": "false", 
    }
} 
```

### Supprimer un utilisateur 

	🔒 DELETE api/users/:id 

__Réponse: 200__ 

```json
{
    "message": "User deleted"
}
```

## Schémas

```
Species: { 
	name: String, 
	description: String, 
	weight: Number, 
	usage: String, 
	picture: String, 
} 
```

```
Mushroom: { 
	specy_id: Number, 
	user_id: Number, 
	picture: String, 
	description?: String, 
	date: Date, 
	location: { 
		lat: String, 
		long: String, 
    }
}	 
```

```
User: { 
	username: String, 
	password: String, 
	email: String,  
	admin: Boolean, 
} 
```

 

