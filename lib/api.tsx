"use server"

import { Client } from "@notionhq/client"

const NOTION_KEY = "secret_TBrHNFurY2CMEeCubgUT4z4M1O1ba5hrJHj3tGZUytH";
const MENU_DATABASE_ID = "e87c01ab-fb0a-477c-a18b-c3345950f6c2";

const notion = new Client({
  auth: NOTION_KEY,
})

export type Dish = {
  name: string,
  ingridients: Array<string>,
  imageURL: string,
  description: string,
}

const dishes: Array<Dish> = [
  {
    name: "Pasta",
    ingridients: ["pasta", "mushrooms", "chicken", "salt", "pepper", "cream"],
    description: "Delisious pasta with simple yet sour creamy sauce with chicken and mushrooms in it.",
    imageURL: "https://images.unsplash.com/photo-1662197480393-2a82030b7b83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=70"
  },
  {
    name: "Curry",
    ingridients: ["curry sauce", "coconut milk", "pineapple bits", "chicken"],
    description: "Wonderful taste of eastern culture. Tastes best with additional sides to it such as rice or potatoes.",
    imageURL: "https://images.unsplash.com/photo-1634234498505-51b316832b28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=70"
  },
]

export async function getDishes() {
  const menuItems = await notion.databases.query({
    database_id: MENU_DATABASE_ID
  })

  return menuItems.results.flatMap(item => {
    if (item.properties.Name.title.length === 0 ||
        item.properties.Description.rich_text.length === 0) {
      return []
    }

    const dish: Dish = {
      name: item.properties.Name.title[0].text.content,
      ingridients: item.properties.Ingridients.multi_select.map(item =>
        item.name
      ),
      description: item.properties.Description.rich_text[0].plain_text,
      imageURL: item.properties.ImageURL.url,
    }

    console.log(dish)

    return [dish]
  })
}
