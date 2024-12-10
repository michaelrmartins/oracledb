#Oracle DB
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)
Essa aplicação retorna dados de um banco Oracle.

Formas de Uso da API: 


# Retorna todos os usuários, com os dados completos
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