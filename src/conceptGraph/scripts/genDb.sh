npx ts-node ./src/conceptGraph/migrations.ts && \
npx ts-node ./src/conceptGraph/scripts/cleanCsv.ts && \
sqlite3 encoreDB ".import --csv --skip 1 ./src/conceptGraph/material/concepts_lexicon.csv concepts_lexicon" && \
sqlite3 encoreDB ".import --csv --skip 1 ./src/conceptGraph/tmp/OER_and_wiki_relationships_hyperlinks_NEW.csv oers_wiki" && \
sqlite3 encoreDB ".import --csv --skip 1 ./src/conceptGraph/tmp/encore_oers.csv encore_oers" && \
sqlite3 encoreDB ".import --csv --skip 1 ./src/conceptGraph/tmp/OER_and_concept_table.csv oers_concept" && \
rm -r ./src/conceptGraph/tmp