using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AlpStoriesPraga.Models
{
    public class LabelModel
    {
        public class templates
        {
            public string templateName { get; set; }
        }
        public class product
        {
            public string productId { get; set; }

            public string productName { get; set; }

            public string bgImageTop { get; set; }

            public string bgImageBottom { get; set; }
            public string elements { get; set; }
            public string description { get; set; }

            public string usage { get; set; }

            public string bestBefore { get; set; }

            public string manufacturer { get; set; }

            public float? price { get; set; }

            public int? quantity { get; set; }

            public string barCode { get; set; }

            public string qrCode { get; set; }

            public string icons { get; set; }
            public string template { get; set; }
        }
    }
}