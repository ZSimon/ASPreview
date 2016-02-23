using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AlpStoriesPraga.Models
{
    public class ProductEditorModel
    {
        public class Item
        {
            public int ingredient_id { get; set; }
            public string name { get; set; }
            public string icon { get; set; }
            public string description { get; set; }
            public float min { get; set; }
            public float max { get; set; }
            public float value { get; set; }
            public float price { get; set; }
            public Int16 selected { get; set; }
            public string productId { get; set; }
            public string pName { get; set; }
            public float pPrice { get; set; }
        }
        public class Ingredient
        {
            public int category_id { get; set; }
            public string name { get; set; }
            public Int16 removable { get; set; }
            public Int16 editable { get; set; }
            [JsonProperty(Order = 4)]
            public List<Item> items;
        }
        public class Product
        {
            public string Id { get; set; }

            public Int16 matched { get; set; }
            public string name { get; set; }
            public string description { get; set; }
            public float basePrice { get; set; }
            public float VAT { get; set; }
            public string currency { get; set; }
            [JsonProperty(Order = 6)]
            public List<Ingredient> ingredients;
        }
    }
}