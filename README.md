# ShroomShare

REST API allowing users to localize where they can gather mushrooms.
The users go into the wild in search for mushrooms. Once they find mushrooms, they picture them and describe them. They then can create a gathering place, which is a physical place containing wild mushrooms.
The other users of the app can then go to the gathering place and confirm whether or not they found mushrooms. Any user can create a gathering place, which is physically in a radius of 1km of where the picture has been taken.

# Table of Contents

- [ShroomShare](#shroomshare)
- [Table of Contents](#table-of-contents)
- [Routes](#routes)
  - [Authentification](#authentification)
    - [Récupérer un token](#récupérer-un-token)
  - [Images](#images)
    - [Récupérer des images](#récupérer-des-images)
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
- [Mongosh](#mongosh)

# Routes 

__Legendes__

- `🔐`: route accesible uniquement aux __administrateurs__
- `🔒`: route accesible uniquement aux __utilisateurs/administrateurs__

## Authentification
### Récupérer un token

	POST api/auth 

__Corps de la reqûete__

```
{ 
    username: String, 
    password: String, 
} 
```

__Réponse 200__

```json
{
    "message": "User connected.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.cMErWtEf7DxCXJl8C9q0L7ttkm-Ex54UWHsOCMGbtUc"
}
```
## Images

### Récupérer des images

	🔐 POST api/pictures

__Corps de la reqûete__

```
{
    pictures_id: String[]
}
```

__Réponse 200__

```json
TODO
```

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
    "message": "Specy succefully created.",
    "specy": {
        "name": "Amanite phalloides",
        "description": "The Amanita phalloides is a ..." ,
        "usage": "non-commestible",
        "pictureId": "636b97a08f7ef3fb6243e92e",
        "id": "636b97a08f7ef3fb6243e92f",
        "picture": {
            "value": "data:image/undefinedbase64, ... ",
            "resource_id": "636b97a08f7ef3fb6243e92f",
            "collectionName": "species",
            "date": "2022-11-09T12:05:51.097Z",
            "id": "636b97a08f7ef3fb6243e92e"
        }
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
    "message": "Specy succefully modified.",
    "specy": {
        "name": "Amanite phalloides",
        "description": "The Amanita phalloides is a ..." ,
        "usage": "non-commestible",
        "pictureId": "636b97a08f7ef3fb6243e92e",
        "id": "636b97a08f7ef3fb6243e92f",
        "picture": {
            "value": "data:image/undefinedbase64, ... ",
            "resource_id": "636b97a08f7ef3fb6243e92f",
            "collectionName": "species",
            "date": "2022-11-09T12:05:51.097Z",
            "id": "636b97a08f7ef3fb6243e92e"
        }
    }
} 
```

### Supprimer une espèce 

	🔐 DELETE api/species/:id 

__Réponse  200__

```json
{ 
    "message": "Specy succefully deleted." 
} 
```

### Retrouver toutes les espèces 

	🔒 GET api/species 

__Filtres__

- `?page=value`: Numéro de la page 
- `?pageSize`: Nombre d’éléments par page 
- `?showPictures`: {boolean} renvoie les images

__Réponse 200__

```json
{
    "message": "Species succefully retrieved.",
    "species": [
        {
            "name": "Amanite phalloides",
            "description": "The Amanita phalloides is a ..." ,
            "usage": "non-commestible",
            "pictureId": "636b97a08f7ef3fb6243e92e",
            "id": "636b97a08f7ef3fb6243e92f",
            "picture": {
                "value": "data:image/undefinedbase64, ... ",
                "resource_id": "636b97a08f7ef3fb6243e92f",
                "collectionName": "species",
                "date": "2022-11-09T12:05:51.097Z",
                "id": "636b97a08f7ef3fb6243e92e"
            }
        }
    ] 
} 
```

### Retrouver une espèce 

	🔒 GET api/species/:id 

__Réponse 200__

```json
{
    "message": "Specy succefully retrieved.",
    "specy": {
        "name": "Amanite phalloides",
        "description": "The Amanita phalloides is a ..." ,
        "usage": "non-commestible",
        "pictureId": "636b97a08f7ef3fb6243e92e",
        "id": "636b97a08f7ef3fb6243e92f",
        "picture": {
            "value": "data:image/undefinedbase64, ... ",
            "resource_id": "636b97a08f7ef3fb6243e92f",
            "collectionName": "species",
            "date": "2022-11-09T12:05:51.097Z",
            "id": "636b97a08f7ef3fb6243e92e"
        }
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
- `?species=String`: Espèce(s) 
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
    "message": "Users succefully retrieved.",
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
    "message": "User succefully retrieved.",
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
    "message": "User succefully created.",
    "user": {
        "username": "John2023", 
        "password": "mySecretPassword", 
        "Email": "john.doe@gmail.com",  
        "admin": "false", 
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NjY1MzAwNTAsInNjb3BlIjoidXNlciIsImlhdCI6MTY2NjQ0MzY1MH0.PPkUvvPJEJZo8nMsT1IykiHvX7kPjhJwmy4saPsdw0I"
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
    "message": "User succefully modified.",
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
    "message": "User succefully deleted."
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
# Mongosh

__Démarer mongodb (MacOS)__

```bash
brew services start mongodb-community@6.0
```

__Arrêter mongodb (MacOS)__

```bash
brew services stop mongodb-community@6.0
```

__Entrer dans mongosh__

Les commandes suivantes sont à éxécuter dans `mongosh`, pour que `mongosh` soit accesible il faut que la base de données soit au préalable démarée.

```bash
mongosh
```

__Lister les db existantes__

```bash
show dbs
```

__Lister les collections existantes__

```bash
show collections
```

__Afficher le nom de la db courante__

```bash
db
```

__AFficher les index d'un schémas__

```bash
db.<schema>.getIndexes()
# exemple
db.users.getIndexes()
```

__Supprimer un index sur un schéma__

```bash
db.<schema>.dropIndex(<indexName>)
# exemple
db.users.dropIndex('username')
```

__Changer de db__

```bash
use <dbName>
```


 

