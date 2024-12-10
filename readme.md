# Oracle DB
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)
Essa aplicação retorna dados de um banco Oracle.

Formas de Uso da API: 


# Retorna todos os usuários, com os dados completos:
```http://192.168.2.214:8073/api/users/```

Saída: 
```
[
    {
        "CD_USUARIO": "NOME.USUARIO",
        "NM_USUARIO": "NOME COMPLETO DO USUÁRIO",
        "CPF": "00000000000",
        "SN_SENHA_PLOGIN": "N|S",
        "SN_ATIVO": "N|S"
    } 
]
```

# Retorna Apenas o CPF de todos os usuários:
```http://192.168.2.214:8073/api/users/CPF```

Saída: 
```
[
    "00000000000"
]
```

# Retorna os dados de um CPF específico:
```http://192.168.2.214:8073/api/users/CPF/12300012399```

Saída: 
```
[
    {
        "CD_USUARIO": "NOME.USUARIO",
        "NM_USUARIO": "NOME COMPLETO DO USUÁRIO",
        "CPF": "12300012399",
        "SN_SENHA_PLOGIN": "N|S",
        "SN_ATIVO": "N|S"
    } 
]
```