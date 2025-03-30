using System.Collections.Generic;

namespace Problemanalysis3.Models
{//for tag
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<QuoteTag> QuoteTags { get; set; } = new List<QuoteTag>();
    }

}
