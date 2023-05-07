library(tidyverse)
require(rworldmap)
data(countryExData)
countries <- tolower(countryExData[, 2])

adjectives <- tidytext::parts_of_speech %>% 
  filter(pos == "Adjective") %>% 
  mutate(word = tolower(word))

name_of_output_file <- "src/R/outputs/sample_graph_api2.json"  

# skill
skill <- "circular economy"

# Import OER dataset
oer_data <- read_csv("src/R/material/encore_oers.csv")

# Import concepts from OER dataset
concept <- read_csv("src/R/material/OER_and_concept_table.csv")

# Import Wikipedia relations
wiki_concepts <- read_csv("src/R/material/OER_and_wiki_relationships_hyperlinks_NEW.csv")

# Filter the oer for specific skill
oer_data_sample <- oer_data %>% 
  filter(str_detect(str_to_lower(str_c(Title, Description, sep = " ")), skill))

# filter extracted concepts of the oer of the specific skill only
tidy_concepts_sample <- concept %>%
  filter(Identifier %in% oer_data_sample$Identifier) %>% 
  separate_rows(extracted_concepts, sep = ",") %>% 
  count(extracted_concepts) %>% 
  arrange(-n) %>% 
  filter(!extracted_concepts %in% adjectives$word)%>% 
  filter(!extracted_concepts %in% countries)

# Filter relations for specific skill 
wiki_concepts_sample <- wiki_concepts %>% 
  filter(Identifier %in% oer_data_sample$Identifier) %>% 
  filter(!concept1 %in% adjectives$word) %>% 
  filter(!concept2 %in% adjectives$word) %>% 
  filter(!concept1 %in% countries) %>%
  filter(!concept2 %in% countries)

wiki_concepts_sample_clean <- wiki_concepts_sample %>% 
  select(concept1, concept2, edge) %>% 
  unique()

# Create graph
wiki_graph <- wiki_concepts_sample_clean %>% 
  filter(edge == 1) %>% 
  tidygraph::as_tbl_graph(directed = F) %>% 
  tidygraph::activate(nodes) %>% 
  mutate(degree = tidygraph::centrality_degree(mode = "all")) %>%
  left_join(tidy_concepts_sample %>% select(name = extracted_concepts, n)) %>% 
  filter(degree > 1) %>%
  #top_n(30, degree) %>% 
  arrange(desc(degree)) %>% 
  filter(row_number() <= 50) %>% 
  mutate(comp = tidygraph::group_components()) %>% 
  filter(comp == 1)

json_nodes = wiki_graph %>% 
  as_tibble() %>% 
  select(-comp) %>% 
  rename(size=n) %>% 
  mutate(node_id = row_number())

json_edges = wiki_graph %>% 
  tidygraph::activate(edges) %>% 
  as_tibble() 

json_data <- jsonlite::toJSON(list(nodes = json_nodes, edges = json_edges))

write(json_data, name_of_output_file)

print("success")
