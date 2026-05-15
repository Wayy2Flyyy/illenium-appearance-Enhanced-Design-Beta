fx_version "cerulean"
game "gta5"

author "W2F Framework — Based on illenium-appearance by snakewiz & iLLeniumStudios"
description "W2F appearance — Player customization forked from illenium-appearance (credits: snakewiz & iLLeniumStudios / iLLeniumStudios)."
repository "https://github.com/iLLeniumStudios/illenium-appearance"
version "v5.7.0"

lua54 "yes"

dependencies {
    "ox_lib",
}

client_scripts {
  "resources/[w2f]/illenium-appearance/game/constants.lua",
  "resources/[w2f]/illenium-appearance/game/util.lua",
  "resources/[w2f]/illenium-appearance/game/customization.lua",
  "resources/[w2f]/illenium-appearance/game/nui.lua",
  "resources/[w2f]/illenium-appearance/client/outfits.lua",
  "resources/[w2f]/illenium-appearance/client/common.lua",
  "resources/[w2f]/illenium-appearance/client/zones.lua",
  "resources/[w2f]/illenium-appearance/client/framework/framework.lua",
  "resources/[w2f]/illenium-appearance/client/framework/qb/compatibility.lua",
  "resources/[w2f]/illenium-appearance/client/framework/qb/main.lua",
  "resources/[w2f]/illenium-appearance/client/framework/qb/migrate.lua",
  "resources/[w2f]/illenium-appearance/client/framework/esx/compatibility.lua",
  "resources/[w2f]/illenium-appearance/client/framework/esx/main.lua",
  "resources/[w2f]/illenium-appearance/client/framework/ox/main.lua",
  "resources/[w2f]/illenium-appearance/client/target/target.lua",
  "resources/[w2f]/illenium-appearance/client/target/qb.lua",
  "resources/[w2f]/illenium-appearance/client/target/ox.lua",
  "resources/[w2f]/illenium-appearance/client/management/management.lua",
  "resources/[w2f]/illenium-appearance/client/management/common.lua",
  "resources/[w2f]/illenium-appearance/client/management/qb.lua",
  "resources/[w2f]/illenium-appearance/client/management/qbx.lua",
  "resources/[w2f]/illenium-appearance/client/management/esx.lua",
  "resources/[w2f]/illenium-appearance/client/radial/radial.lua",
  "resources/[w2f]/illenium-appearance/client/radial/qb.lua",
  "resources/[w2f]/illenium-appearance/client/radial/ox.lua",
  "resources/[w2f]/illenium-appearance/client/turntable.lua",
  "resources/[w2f]/illenium-appearance/client/stats.lua",
  "resources/[w2f]/illenium-appearance/client/defaults.lua",
  "resources/[w2f]/illenium-appearance/client/blips.lua",
  "resources/[w2f]/illenium-appearance/client/props.lua",
  "resources/[w2f]/illenium-appearance/client/client.lua",
}

server_scripts {
  "@oxmysql/lib/MySQL.lua",
  "resources/[w2f]/illenium-appearance/server/database/database.lua",
  "resources/[w2f]/illenium-appearance/server/database/jobgrades.lua",
  "resources/[w2f]/illenium-appearance/server/database/managementoutfits.lua",
  "resources/[w2f]/illenium-appearance/server/database/playeroutfitcodes.lua",
  "resources/[w2f]/illenium-appearance/server/database/playeroutfits.lua",
  "resources/[w2f]/illenium-appearance/server/database/players.lua",
  "resources/[w2f]/illenium-appearance/server/database/playerskins.lua",
  "resources/[w2f]/illenium-appearance/server/database/users.lua",
  "resources/[w2f]/illenium-appearance/server/framework/qb/main.lua",
  "resources/[w2f]/illenium-appearance/server/framework/qb/migrate.lua",
  "resources/[w2f]/illenium-appearance/server/framework/esx/main.lua",
  "resources/[w2f]/illenium-appearance/server/framework/esx/migrate.lua",
  "resources/[w2f]/illenium-appearance/server/framework/esx/callbacks.lua",
  "resources/[w2f]/illenium-appearance/server/framework/esx/management.lua",
  "resources/[w2f]/illenium-appearance/server/framework/ox/main.lua",
  "resources/[w2f]/illenium-appearance/server/util.lua",
  "resources/[w2f]/illenium-appearance/server/server.lua",
  "resources/[w2f]/illenium-appearance/server/permissions.lua"
}

shared_scripts {
  "@ox_lib/init.lua",
  "resources/[w2f]/illenium-appearance/shared/config.lua",
  "resources/[w2f]/illenium-appearance/shared/blacklist.lua",
  "resources/[w2f]/illenium-appearance/shared/peds.lua",
  "resources/[w2f]/illenium-appearance/shared/tattoos.lua",
  "resources/[w2f]/illenium-appearance/shared/theme.lua",
  "resources/[w2f]/illenium-appearance/shared/framework/framework.lua",
  "resources/[w2f]/illenium-appearance/shared/framework/esx/util.lua",
  "resources/[w2f]/illenium-appearance/locales/locales.lua",
  "resources/[w2f]/illenium-appearance/locales/ar.lua",
  "resources/[w2f]/illenium-appearance/locales/bg.lua",
  "resources/[w2f]/illenium-appearance/locales/cs.lua",
  "resources/[w2f]/illenium-appearance/locales/de.lua",
  "resources/[w2f]/illenium-appearance/locales/en.lua",
  "resources/[w2f]/illenium-appearance/locales/es-ES.lua",
  "resources/[w2f]/illenium-appearance/locales/fr.lua",
  "resources/[w2f]/illenium-appearance/locales/hu.lua",
  "resources/[w2f]/illenium-appearance/locales/it.lua",
  "resources/[w2f]/illenium-appearance/locales/nl.lua",
  "resources/[w2f]/illenium-appearance/locales/pt-BR.lua",
  "resources/[w2f]/illenium-appearance/locales/ro-RO.lua",
  "resources/[w2f]/illenium-appearance/locales/id.lua"
}

files {
  "resources/[w2f]/illenium-appearance/web/dist/index.html",
  "resources/[w2f]/illenium-appearance/web/dist/assets/*.js"
}

ui_page "resources/[w2f]/illenium-appearance/web/dist/index.html"
