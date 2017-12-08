service-providers-examples
==========================

Exemples de fournisseurs de services pour France-connect :
- 1 exemple en NodeJS avec la librairie Passport

Exemples fournis par des partenaires :
- [https://gitlab.laposte.io/rmagnac/france-connect-workshop](https://gitlab.laposte.io/rmagnac/france-connect-workshop) : exemple en Ruby, sans librairie
- [https://github.com/Lyon-Metropole/poc-france-connect](https://github.com/Lyon-Metropole/poc-france-connect) : exemple en Ruby / Sinatra / Omniauth et OpenID
- [https://adullact.net/scm/viewvc.php/?root=hackathon-fc](https://adullact.net/scm/viewvc.php/?root=hackathon-fc) : exemple en PHP
- [https://github.com/florent-andre/franceconnecthelper](https://github.com/florent-andre/franceconnecthelper) : exemple en Java avec la librairie Apache Oltu
- [https://github.com/astik/poc-franceconnect](https://github.com/astik/poc-franceconnect) : nouvel exemple en Java, toujours avec Oltu, réalisé lors du workshop du 20 Janvier 2016. Ce nouvel exemple se base sur celui de Florent Andre, et inclut, en plus, la déconnexion


# Fournisseur de Service

Params obligatoires pour authorize :
 - client ID
  - callback URL
  - scope
  - state
  - nonce

[`doc de référence`](https://fr.wikipedia.org/wiki/Markdown#Liens)

# Config valide exemple :
```json
{
  "fcURL": "https://fcp.integ01.dev-franceconnect.fr",
  "openIdParameters": {
    "clientID": "9c771146e9ff7f45a7613ced4be01581b3abbd8e25d45fb3e45559b2577c5030",
    "clientSecret": "3eb1c3fdd79669e3e4a5971ea0ac06804f27f6cbb20f29daebda95e755677ecb",
    "callbackURL": "http://localhost:8000/callback",
    "authorizationURL": "https://fcp.integ01.dev-franceconnect.fr/api/v1/authorize",
    "tokenURL": "https://fcp.integ01.dev-franceconnect.fr/api/v1/token",
    "userInfoURL": "https://fcp.integ01.dev-franceconnect.fr/api/v1/userinfo",
    "logoutURL":"https://fcp.integ01.dev-franceconnect.fr/api/v1/logout",
    "scope": "openid email phone given_name",
    "state": "myTestServiceState",
    "nonce": "timestamp123"
  }
}
