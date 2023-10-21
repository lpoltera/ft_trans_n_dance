# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ldervode <marvin@42lausanne.ch>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/04/23 11:25:27 by ldervode          #+#    #+#              #
#    Updated: 2023/04/23 11:25:27 by ldervode         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME = inception

# Définir l'outil à utiliser (docker-compose)
DC=docker-compose

# Chemin vers le fichier docker-compose.yml
COMPOSE_FILE=docker-compose.yml

# Définir les commandes Make
build:
	$(DC) -f $(COMPOSE_FILE) build

up:
	$(DC) -f $(COMPOSE_FILE) up -d

down:
	$(DC) -f $(COMPOSE_FILE) down

logs:
	$(DC) -f $(COMPOSE_FILE) logs -f

ps:
	$(DC) -f $(COMPOSE_FILE) ps

restart:
	$(DC) -f $(COMPOSE_FILE) restart

clean:
	$(DC) -f $(COMPOSE_FILE) down
	docker system prune -f
	docker rmi $$(docker images -a -q)
	docker volume prune


# Commande par défaut (sans arguments)
.PHONY: build up down logs ps restart
