using System.Text.Json.Serialization;

namespace Problemanalysis3.Models
{//For QuoteTag
    public class QuoteTag
    {
        public int QuoteId { get; set; }
        public Quote Quote { get; set; } = null!;
        [JsonIgnore]
        public int TagId { get; set; }
        public Tag Tag { get; set; } = null!;
    }
}
