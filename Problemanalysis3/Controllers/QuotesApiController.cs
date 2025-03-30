using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Problemanalysis3.Data;
using Problemanalysis3.Models;

namespace Problemanalysis3.Controllers
{// Controller
    [Route("api/quotes")]
    [ApiController]
    public class QuotesApiController : ControllerBase
    {
        private readonly QuoteDbContext _context;

        public QuotesApiController(QuoteDbContext context)
        {
            _context = context;
        }
        //For get
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Quote>>> GetQuotes()
        {
            var quotes = await _context.Quotes
                .Include(q => q.QuoteTags)
                .ThenInclude(qt => qt.Tag)
                .ToListAsync();
            return Ok(quotes);
        }
        //For getting the most liked ones 
        [HttpGet("mostliked")]
        public async Task<ActionResult<IEnumerable<Quote>>> GetMostLikedQuotes(int count = 10)
        {
            var quotes = await _context.Quotes
                .OrderByDescending(q => q.Likes)
                .Take(count)
                .ToListAsync();
            return Ok(quotes);
        }
        //For post
        [HttpPost]
        public async Task<ActionResult<Quote>> PostQuote(Quote quote)
        {
            _context.Quotes.Add(quote);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetQuotes), new { id = quote.Id }, quote);
        }
        //for put
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuote(int id, Quote quote)
        {
            if (id != quote.Id) return BadRequest();

            _context.Entry(quote).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Quotes.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }
        //FOr delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuote(int id)
        {
            var quote = await _context.Quotes.FindAsync(id);
            if (quote == null) return NotFound();

            _context.Quotes.Remove(quote);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        //For posting Like
        [HttpPost("{id}/like")]
        public async Task<IActionResult> LikeQuote(int id)
        {
            var quote = await _context.Quotes.FindAsync(id);
            if (quote == null) return NotFound();

            quote.Likes += 1;
            await _context.SaveChangesAsync();

            return Ok(quote);
        }
    }
}
