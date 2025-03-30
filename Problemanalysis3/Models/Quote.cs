using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Problemanalysis3.Models
{// For class Quote 
    public class Quote
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public string? Author { get; set; }
        public int Likes { get; set; } = 0;

        public List<QuoteTag> QuoteTags { get; set; } = new List<QuoteTag>();
    }
}
