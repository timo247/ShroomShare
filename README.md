# ShroomShare

REST API allowing users to localize where they gather mushrooms.
This application allows administrator to create species, which are different type of mushrooms that can be found into the wild.
Then, the app users may find mushrooms into the wild corresponding to the available species. When they do, they then can picture them, localize them,describe them and send these informations into the app. Then, all the users can know that the particular specy can be found at the location where the user took the picture.

# Table of Contents

- [ShroomShare](#shroomshare)
- [Table of Contents](#table-of-contents)
- [Chat](#chat)
- [Routes](#routes)
  - [Authentification](#authentification)
    - [Récupérer un token](#récupérer-un-token)
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
  - [Images](#images)
    - [Retrouver des images](#retrouver-des-images)

# Chat

ShroomShare dispose d'un chat avec différents channels chacun associé à une langue différente. Lors de la première connexion au chat, il est possible de préciser le channel auxquel on souhaite se connecter au moyen du query parameter appelé `language`. Si aucuns query parameter n'est préciser alors l'utilisateur est par défault connecté au channel anglais. A préciser que le chat est réservé aux utilisateurs authentifié.

Les messages n'ont pas besoin de respecter un format particulier, il peuvent être directement saisis tels quels, null besoin de recourir au JSON ou un autre format relativement élaboré.

__Accéder au chat__

```
 ws://127.0.0.1:3000/ 
```
__Query parameter__

- `language`: `enum ['fr'|'en'|'it'|'de']`

__Réponses: message envoyé__

```json
{
    "status": "Message received.",
    "message": "hello",
    "timestamp": 1668253852370,
    "user": {
        "username": "user01",
        "admin": false,
        "id": "636b979f8f7ef3fb6243e8f3"
    }
}
```
__Réponses: utilisateur connecté__

```json
{
    "status": "User connected.",
    "timestamp": 1668253811261,
    "user": {
        "username": "user01",
        "admin": false,
        "id": "636b979f8f7ef3fb6243e8f3"
    }
}
```
__Réponses: utilisateur déconnecté__

```json
{
    "status": "User disconnected.",
    "timestamp": 1668253852370,
    "user": {
        "username": "user01",
        "admin": false,
        "id": "636b979f8f7ef3fb6243e8f3"
    }
}
```
# Routes

**Legendes**

- `🔐`: route accesible uniquement aux **administrateurs**
- `🔒`: route accesible uniquement aux **utilisateurs/administrateurs**

## Authentification

### Récupérer un token

    POST api/auth

**Corps de la reqûete**

```
{
    username: String,
    password: String,
}
```

**Réponse 200**

```json
{
  "message": "Token succesfully created.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.cMErWtEf7DxCXJl8C9q0L7ttkm-Ex54UWHsOCMGbtUc"
}
```
## Espèces (de champignons)

### Ajouter une espèce

    🔐 POST api/species

**Corps de la reqûete**

```
{ 
    name: String, 
    description: String, 
    usage: String, 
    picture: base64String, 
} 
```

**Réponse 201**

```json
{
  "message": "Specy successfully created.",
  "specy": {
    "name": "Amanite phalloides",
    "description": "The Amanita phalloides is a ...",
    "usage": "non-commestible",
    "picture_id": "636b97a08f7ef3fb6243e92e",
    "id": "636b97a08f7ef3fb6243e92f",
    "picture": {
      "value": "data:image/undefinedbase64, ... ",
      "specy_id": "636b97a08f7ef3fb6243e92f",
      "collectionName": "species",
      "date": "2022-11-09T12:05:51.097Z",
      "id": "636b97a08f7ef3fb6243e92e"
    }
  }
}
```

### Modifier une espèce

    🔐 PATCH api/species/:id

**Corps de la reqûete**

```
{
    name?: String,
    description?: String,
    usage?: String,
    picture?: base64String,
}
```

**Réponse 200**

```json
{
  "message": "Specy successfully modified.",
  "specy": {
    "name": "Amanite phalloides",
    "description": "The Amanita phalloides is a ...",
    "usage": "non-commestible",
    "picture_id": "636b97a08f7ef3fb6243e92e",
    "id": "636b97a08f7ef3fb6243e92f",
    "picture": {
      "value": "data:image/undefinedbase64, ... ",
      "specy_id": "636b97a08f7ef3fb6243e92f",
      "collectionName": "species",
      "date": "2022-11-09T12:05:51.097Z",
      "id": "636b97a08f7ef3fb6243e92e"
    }
  }
}
```

### Supprimer une espèce

    🔐 DELETE api/species/:id

**Réponse 200**

```json
{
  "message": "Specy successfully deleted."
}
```

### Retrouver toutes les espèces

    🔒 GET api/species

**Filtres**

- `?page=value`: Numéro de la page
- `?pageSize`: Nombre d’éléments par page
- `?showPictures`: {boolean} renvoie les images

**Réponse 200**

```json
{
  "message": "Species successfully retrieved.",
  "species": [
    {
      "name": "Amanite phalloides",
      "description": "The Amanita phalloides is a ...",
      "usage": "non-commestible",
      "picture_id": "636b97a08f7ef3fb6243e92e",
      "id": "636b97a08f7ef3fb6243e92f",
      "picture": {
        "value": "data:image/undefinedbase64, ... ",
        "specy_id": "636b97a08f7ef3fb6243e92f",
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

**Réponse 200**

```json
{
  "message": "Specy successfully retrieved.",
  "specy": {
    "name": "Amanite phalloides",
    "description": "The Amanita phalloides is a ...",
    "usage": "non-commestible",
    "picture_id": "636b97a08f7ef3fb6243e92e",
    "id": "636b97a08f7ef3fb6243e92f",
    "picture": {
      "value": "data:image/undefinedbase64, ... ",
      "specy_id": "636b97a08f7ef3fb6243e92f",
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

**Corps de la requête**

```
{
    specy_id: Number,
    picture: base64String,
    description?: String,
    date: Date,
      location: {
        type: enum [Point], 
        coordinates: number[]
      },
    }
}
```

**Réponse 200**

```json
{
  "message": "Mushroom successfully added.",
  "mushroom": {
    "specy_id": "636b97a08f7ef3fb6243e92f",
    "user_id": "636b97a08f7ef3fb6243e92f",
    "picture_id": "636b97a08f7ef3fb6243e92e",
    "description": "This is a Amanita phalloides...",
    "date": "2022.01.01",
    "id": "636b97a08f7ef3fb6243e92f",
    "picture": {
      "value": "data:image/undefinedbase64, ... ",
      "specy_id": "636b97a08f7ef3fb6243e92f",
      "mushroom_id": "636b97a08f7ef3fb6243e92f",
      "user_id": "636b97a08f7ef3fb6243e92f",
      "collectionName": "species",
      "date": "2022-11-09T12:05:51.097Z",
      "id": "636b97a08f7ef3fb6243e92e"
    },
    "location": {
      "type": "Point", 
      "coordinates": [ 46.616517,6.234434 ]
    },
  }
}
```

### Supprimer un champignon

    🔒 DELETE api/mushrooms/:id

**Réponse: 200**

```json
{
  "message": "Mushroom successfully deleted."
}
```

### Modifier un champignon

    🔒 PATCH api/mushrooms/:id

**Corps de la requête**

```
{
    specy_id?: Number,
    picture?: base64String
    description?: String,
    date?: Date,
      location: {
        type: enum [Point], 
        coordinates: number[]
      },
}
```

**Réponse: 200**

```json
{
  "message": "Mushroom successfully updated.",
  "mushroom": {
    "specy_id": "636b97a08f7ef3fb6243e92f",
    "user_id": "636b97a08f7ef3fb6243e92f",
    "picture_id": "636b97a08f7ef3fb6243e92e",
    "description": "This is a Amanita phalloides...",
    "date": "2022.01.01",
    "id": "636b97a08f7ef3fb6243e92f",
    "picture": {
      "value": "data:image/undefinedbase64, ... ",
      "mushroom_id": "636b97a08f7ef3fb6243e92f",
      "user_id": "636b97a08f7ef3fb6243e92f",
      "specy_id": "636b97a08f7ef3fb6243e92f",
      "collectionName": "species",
      "date": "2022-11-09T12:05:51.097Z",
      "id": "636b97a08f7ef3fb6243e92e"
    },
    "location": {
      "type": "Point", 
      "coordinates": [ 46.616517,6.234434 ]
    },
  }
}
```

### Retrouver des champignons

    🔒 GET api/mushrooms

**Filtres disponibles**

- `?latitude=Number`: Coordonnée GPS
- `?longitude=Number`: Coordonnée GPS
- `?specyId=String`: Id de l'espèce
- `?userId=Integer`: Id de l'utilisateur
- `?showPictures=Boolean`: affiche ou non les images
- `?from=Date`: Date de début
- `?to=Date`: Date de Fin
- `?page=value`: Numéro de la page
- `?pageSize`: Nombre d’éléments par page

**Réponse: 200**

```json
{
  "message": "Mushrooms successfully retrieved.",
  "mushroom": [
    {
      "specy_id": "636b97a08f7ef3fb6243e92f",
      "user_id": "636b97a08f7ef3fb6243e92f",
      "picture_id": "636b97a08f7ef3fb6243e92e",
      "description": "This is a Amanita phalloides...",
      "date": "2022.01.01",
      "id": "636b97a08f7ef3fb6243e92f",
      "picture": {
        "value": "data:image/undefinedbase64, ... ",
        "specy_id": "636b97a08f7ef3fb6243e92f",
        "mushroom_id": "636b97a08f7ef3fb6243e92f",
        "user_id": "636b97a08f7ef3fb6243e92f",
        "collectionName": "species",
        "date": "2022-11-09T12:05:51.097Z",
        "id": "636b97a08f7ef3fb6243e92e"
      },
      "location": {
        "type": "Point", 
        "coordinates": [ 46.616517,6.234434 ]
      },
    }
  ]
}
```

## Utilisateurs

### Retrouver tous les utilisateurs

    🔒 GET api/users

**Filtres**

- `?page=value`: Numéro de la page
- `?pageSize`: Nombre d’éléments par page

**Réponse: 200**

```json
{
  "message": "Users successfully retrieved.",
  "users": [
    {
      "username": "John2022",
      "admin": "false"
    }
  ]
}
```

### Retrouver un utilisateur

    🔒 GET api/users/:id

**Réponse: 200**

```json
{
  "message": "User successfully retrieved.",
  "user": {
    "username": "John2023",
    "admin": "false"
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

**Réponse 201**

```json
{
  "message": "User successfully created.",
  "user": {
    "username": "John2023",
    "password": "mySecretPassword",
    "Email": "john.doe@gmail.com",
    "admin": "false"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NjY1MzAwNTAsInNjb3BlIjoidXNlciIsImlhdCI6MTY2NjQ0MzY1MH0.PPkUvvPJEJZo8nMsT1IykiHvX7kPjhJwmy4saPsdw0I"
}
```

### Modifier un utilisateur

    🔒 PATCH api/users/:id

**Corps de la requête**

```
{
    username?: String,
    password?: String,
    email?: String,
    admin?: Boolean,
}
```

**Réponse: 200**

```json
{
  "message": "User successfully modified.",
  "user": {
    "username": "John2023",
    "password": "mySecretPassword",
    "Email": "john.doe@gmail.com",
    "admin": "false"
  }
}
```

### Supprimer un utilisateur

    🔒 DELETE api/users/:id

**Réponse: 200**

```json
{
  "message": "User successfully deleted."
}
```

## Images

### Retrouver des images

    🔒 POST api/pictures

**Corps de la requête**

```
{
    ids: String[]
}

```

**Réponse: 200**

```json
{
  "message": "Pictures successfully retrieved.",
  "pictures": [
     {
        "value": "data:image/jpgbase64, /9j/4AAQSkZJRgABAQAAAQABAAD/",
        "specy_id": "636cca7ec8fff49b7d347e5d",
        "collectionName": "species",
        "date": "2022-11-10T09:55:08.571Z",
        "id": "636cca7ec8fff49b7d347e5c"
     }
  ]
}
```
