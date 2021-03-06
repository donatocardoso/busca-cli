# ✅ busca-cli

Escrito em [node](http://nodejs.org), é uma ferramenta muito simples para realizar buscas em pastas e arquivos a partir do terminal, utilizando padrão **E/AND** para filtrar os arquivos, independende da ordem das palavras ou se estão em sequencia, podendo personalizar os o filtro conforme opções disponiveis em cada comando. [Veja como usar cada comando!](#comandos)

Uma pequena experiência de aprendizagem js e node (e apenas se divertindo).

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
![badge-statements]
![badge-branches]
![badge-functions]
![badge-lines]

---

## 🔹 Pré Requisitos

1. node
1. npm

---

## 🔹 Instalação

```
npm install -g busca-cli
```

Ou

```
yarn add -G busca-cli
```

Outra alternativa, você pode baixar este repositório e instalar a partir da fonte:

```
git clone https://github.com/latrokles/busca-cli.git
cd busca-cli
npm install
npm link
```

---

## 🔹 Uso

Para utilizar a ferramenta use da opção "-a" ou "--ajuda" para obter ajuda:

```
Usage: busca-cli [comando]

Options:
  -v,   --versao             Exibi a versão atual
  -a,   --ajuda              Exibi ajuda para usar o comando

Commands:
  arquivo   [options] <texto>    Verifica se o(s) arquivo(s) possue(em) o texto informado
  carregar  [options]            Carrega em memória os arquivos do diretório informado
  pasta     [options] <texto>    Busca arquivos no diretório desejado que possuem o texto informado
```

---

## Comandos

Para os próximos exemplos vamos considerar os seguintes arquivos:

```
nome: ./pasta01/arquivo01.txt

conteúdo: night catches us 2010 anthony mackie kerry washington wendell pierce tanya hamilton tanya hamilton
```

```
nome: ./pasta02/arquivo02.txt

conteúdo: Night catches us 2010 anthony mackie kerry washington Wendell pierce tanya hamilton tanya Hamilton
```

Exemplos de uso dos comandos:

1. **_busca-cli arquivo_**

- Realiza uma busca com uma sentença chave nos arquivos informados, veja a estrutura do comando:

- O parametro **_texto_** é obrigatório e deve ser informado com o uso de aspas simples ou duplas.
- A opção **_caminhos_** é obrigatório e deve ser informada com um ou mais valores.

```
busca-cli arquivo [opcoes] <texto> -c [caminhos...]
```

- As opções do comando são:

```
-c, --caminhos  [caminhos...]   Arquivo(s) em que a verificação será realizada
-d, --detalhes                  Retorna detalhes do(s) arquivo(s)
-e, --exato                     Busca pela sentença exata informada
-s, --sensivel                  Diferencia maiúscula de minúscula
-a, --ajuda                     Exibi ajuda para usar o comando
```

- Exemplos de chamada:

```
$ busca-cli arquivo "night wendell hamilton" -c ./pasta01/arquivo01.txt ./pasta02/arquivo02.txt
$ busca-cli arquivo -des "night wendell hamilton" -c ./pasta01/arquivo01.txt ./pasta02/arquivo02.txt
$ busca-cli arquivo -d -e -s "night wendell hamilton" -c ./pasta01/arquivo01.txt ./pasta02/arquivo02.txt
```

2. **_busca-cli pasta_**

- Realiza uma busca com uma sentença chave nas pastas informadas, veja a estrutura do comando:

- O parametro **_texto_** é obrigatório e deve ser informado com o uso de aspas simples ou duplas.
- A opção **_caminhos_** é obrigatório e deve ser informada com um ou mais valores.

```
busca-cli pasta [opcoes] <texto> -c [caminhos...]
```

- As opções do comando são:

```
-c,   --caminhos  [caminhos...]  Diretório(s) em que a verificação será realizada
-d,   --detalhes                 Retorna detalhes dos arquivos encontrados
-e,   --exato                    Busca pela sentença exata informada
-r,   --recursivo                Busca na pasta e sub-pastas do caminho informado
-s,   --sensivel                 Diferencia maiúscula de minúscula
-a,   --ajuda                    Exibi ajuda para usar o comando
```

- Exemplos de chamada:

```
$ busca-cli pasta "night wendell hamilton" -c ./pasta01 ./pasta02
$ busca-cli pasta -ders "night wendell hamilton" -c ./pasta01 ./pasta02
$ busca-cli pasta -d -e -r -s "night wendell hamilton" -c ./pasta01 ./pasta02
```

3. **_busca-cli carregar_**

- Carrega as pastas e/ou arquivos informados em memória e em seguida faz solicitação de uma entrada com uma sentença chave para realizar a busca, veja a estrutura do comando:

- A opção **_caminhos_** é obrigatório e deve ser informada com um ou mais valores.

```
busca-cli carregar [opcoes] -c [caminhos...]
```

- As opções do comando são:

```
-c,   --caminhos  [caminhos...]  Arquivo(s) em que a verificação será realizada
-d,   --detalhes                 Retorna detalhes dos arquivos encontrados
-e,   --exato                    Busca pela sentença exata informada
-r,   --recursivo                Busca na pasta e sub-pastas do caminho informado
-s,   --sensivel                 Diferencia maiúscula de minúscula
-a,   --ajuda                    Exibi ajuda para usar o comando
```

- Exemplos de chamada:

```
$ busca-cli carregar "night wendell hamilton" -c ./pasta01 ./pasta02/arquivo02.txt
$ busca-cli carregar -ders "night wendell hamilton" -c ./pasta01 ./pasta02/arquivo02.txt
$ busca-cli carregar -d -e -r -s "night wendell hamilton" -c ./pasta01 ./pasta02/arquivo02.txt
```

---

## Licença

[MIT](LICENSE)

[badge-branches]: ./__tests__/badges/badge-branches.svg
[badge-functions]: ./__tests__/badges/badge-functions.svg
[badge-lines]: ./__tests__/badges/badge-lines.svg
[badge-statements]: ./__tests__/badges/badge-statements.svg
[npm-image]: https://img.shields.io/npm/v/express-swagger-delta.svg
[npm-url]: https://npmjs.org/package/express-swagger-delta
[downloads-image]: https://img.shields.io/npm/dm/express-swagger-delta.svg
[downloads-url]: https://npmjs.org/package/express-swagger-delta
