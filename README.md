# ShroomShare

API REST permettant aux utilisateurs de localiser où ils récoltent des champignons. Cette application permet aux administrateurs de créer des espèces, qui sont différents types de champignons qui peuvent être trouvés dans la nature. Ensuite, les utilisateurs de l'application peuvent trouver des champignons dans la nature correspondant aux espèces disponibles. Lorsqu'ils le font, ils peuvent alors les photographier, les localiser, les décrire et envoyer ces informations dans l'application. Ensuite, tous les utilisateurs peuvent savoir que cette espèce particulière peut être trouvée à l'emplacement où l'utilisateur a pris la photo.

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
 wss://shroom-share.onrender.com 
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
    "user": {
        "username": "user01",
        "admin": false,
        "id": "63a9a601147117f37fb3bdc0"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2M2E5YTYwMTE0NzExN2YzN2ZiM2JkYzAiLCJleHAiOjE2NzI4MjYzOTgsInNjb3BlIjoidXNlciIsImlhdCI6MTY3MjIyMTU5OH0.glO6VOM88FLTzgu-HJhcBIAlpdDWxnVAYD39Ir4VUFc"
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
    "id": "636b97a08f7ef3fb6243e92f",
    "picture": {
      "value": "data:image/undefinedbase64, ... ",
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
    "id": "636b97a08f7ef3fb6243e92f",
    "picture": {
      "value": "data:image/undefinedbase64, ... ",
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
- `?count`: {boolean} compte les espèces
- `?search`: {string} Recherche par chaîne de character

**Réponse 200**

```json
{
    "message": "Species successfully retrieved.",
    "items": [
        {
            "name": "Amanite phalloïde",
            "description": "Une partie du voile initial forme un anneau mou...",
            "usage": "non-commestible",
            "picture": "63a9a602147117f37fb3bdf9",
            "id": "63a9a602147117f37fb3bdfa"
        },
    ],
    "currentPage": 1,
    "pageSize": 5,
    "lastPage": 4
}
```

Si le param `count` est utilisé alors le serveur retourne ce genre de réponse

```json
{
    "message": "Species successfully counted.",
    "count": 20
}
```

### Retrouver une espèce

    🔒 GET api/species/:id

**Réponse 200**

```json
{
    "message": "Specy successfully retrieved.",
    "specy": {
        "name": "Amanite phalloïde",
        "description": "Une partie du voile initial forme un anneau mou...",
        "usage": "non-commestible",
        "id": "63a9a602147117f37fb3bdfa",
        "picture": {
            "value": "data:image/...",
            "specy": "63a9a602147117f37fb3bdfa",
            "collectionName": "species",
            "date": "2022-12-26T13:47:45.809Z",
            "id": "63a9a602147117f37fb3bdf9",
        },
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
    "specy": "636b97a08f7ef3fb6243e92f",
    "user": "636b97a08f7ef3fb6243e92f",
    "description": "This is a Amanita phalloides...",
    "date": "2022.01.01",
    "id": "636b97a08f7ef3fb6243e92f",
    "picture": {
      "value": "data:image/undefinedbase64, ...",
      "specy": "636b97a08f7ef3fb6243e92f",
      "mushroom": "636b97a08f7ef3fb6243e92f",
      "user": "636b97a08f7ef3fb6243e92f",
      "collectionName": "mushrooms",
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
    "specy": "636b97a08f7ef3fb6243e92f",
    "user": "636b97a08f7ef3fb6243e92f",
    "description": "This is a Amanita phalloides...",
    "date": "2022.01.01",
    "id": "636b97a08f7ef3fb6243e92f",
    "picture": {
      "value": "data:image/undefinedbase64, ... ",
      "mushroom": "636b97a08f7ef3fb6243e92f",
      "user": "636b97a08f7ef3fb6243e92f",
      "specy": "636b97a08f7ef3fb6243e92f",
      "collectionName": "mushrooms",
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
- `?specyIds=String`: les ids des espèces, séparé par des virgules
- `?userIds=Integer`: les ids des utilisateurs séparé par des virgules
- `?showPictures=Boolean`: affiche ou non les images
- `?from=Date`: Date de début
- `?to=Date`: Date de Fin
- `?page=value`: Numéro de la page
- `?pageSize`: Nombre d’éléments par page
- `?usage`: soit `edible` ou `inedible`
- `?radius`: Le rayon de recherche des champignon

**Réponse: 200**

Sans images 

```json
{
    "message": "Mushrooms successfully retrieved.",
    "currentPage": 1,
    "pageSize": 5,
    "lastPage": 2,
    "items": [
        {
            "location": {
                "type": "Point",
                "coordinates": [
                    5.767669,
                    46.261447
                ]
            },
            "specy": {
                "name": "Amanite tue-mouches",
                "description": "L'amanite tue-mouches...",
                "usage": "non-commestible",
                "picture": "63a9a602147117f37fb3bdff",
                "id": "63a9a602147117f37fb3be00"
            },
            "user": {
                "username": "user05",
                "admin": false,
                "id": "63a9a602147117f37fb3bdcc"
            },
            "picture": "63a9a602147117f37fb3be79",
            "description": "J'ai trouvé ce magnifique spécimen...",
            "date": "2022-12-26T13:47:46.723Z",
            "id": "63a9a602147117f37fb3be7a"
        }
    ]
}
```

Avec images

```json
{
    "message": "Mushrooms successfully retrieved.",
    "currentPage": 1,
    "pageSize": 5,
    "lastPage": 2,
    "items": [
        {
            "location": {
                "type": "Point",
                "coordinates": [
                    5.767669,
                    46.261447
                ]
            },
            "specy": {
                "name": "Amanite tue-mouches",
                "description": "L'amanite tue-mouches...",
                "usage": "non-commestible",
                "picture": "63a9a602147117f37fb3bdff",
                "id": "63a9a602147117f37fb3be00"
            },
            "user": {
                "username": "user05",
                "admin": false,
                "id": "63a9a602147117f37fb3bdcc"
            },
            "picture": {
                "value": "data:image/undefinedbase64, ...",
                "specy": "63a9a602147117f37fb3bde8",
                "mushroom": "63a9a602147117f37fb3be5a",
                "collectionName": "mushrooms",
                "date": "2022-12-26T13:47:45.809Z",
                "user": "63a9a601147117f37fb3bdc0",
                "id": "63a9a602147117f37fb3be59"
            },
            "description": "J'ai trouvé ce magnifique spécimen...",
            "date": "2022-12-26T13:47:46.723Z",
            "id": "63a9a602147117f37fb3be7a"
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
- `?search`: Le nom de l'utilisateur souhaité

**Réponse: 200**

```json
{
    "message": "Users successfully retrieved.",
    "items": [
        {
            "username": "user02",
            "admin": true,
            "id": "63a9a601147117f37fb3bdc3"
        }
    ],
    "currentPage": 1,
    "pageSize": 1,
    "lastPage": 1
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
    "id": "63a9a602147117f37fb3bddd"
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
    "admin": "false"
    "id": "636cca7ec8fff49b7d347e5c"
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
    "admin": "false"
    "id": "636cca7ec8fff49b7d347e5c"
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

Exemple d'un tableau contenant l'image d'un champignon.

```json
{
  "message": "Pictures successfully retrieved.",
  "pictures": [
     {
        "value": "data:image/jpgbase64, /9j/4AAQSkZJRgABAQAAAQABAAD/",
        "specy": "636cca7ec8fff49b7d347e5d",
        "mushroom": "636cca7ec8fff49b7d347e5e",
        "collectionName": "mushroom",
        "date": "2022-11-10T09:55:08.571Z",
        "id": "636cca7ec8fff49b7d347e5c"
     }
  ]
}
```

Exemple d'un tableau contenant l'image d'une espèce.

```json
{
  "message": "Pictures successfully retrieved.",
  "pictures": [
     {
        "value": "data:image/jpgbase64, /9j/4AAQSkZJRgABAQAAAQABAAD/",
        "specy": "636cca7ec8fff49b7d347e5d",
        "collectionName": "species",
        "date": "2022-11-10T09:55:08.571Z",
        "id": "636cca7ec8fff49b7d347e5c"
     }
  ]
}
```
