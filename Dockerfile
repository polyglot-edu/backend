FROM node:17.8

WORKDIR /backend

RUN apt-get update && \
    apt-get install sqlite3 curl -y

ADD . .

RUN npm install

# Download materials to generate db
RUN curl https://papygame.com/Encore/concepts_lexicon.csv --output src/conceptGraph/material/concepts_lexicon.csv && \
    curl https://papygame.com/Encore/encore_oers.csv --output src/conceptGraph/material/encore_oers.csv && \
    curl https://papygame.com/Encore/OER_and_concept_table.csv --output src/conceptGraph/material/OER_and_concept_table.csv && \
    curl https://papygame.com/Encore/OER_and_wiki_relationships_hyperlinks_NEW.csv --output src/conceptGraph/material/OER_and_wiki_relationships_hyperlinks_NEW.csv


RUN npm run encore:dbInit

CMD [ "npm", "run", "start" ]
