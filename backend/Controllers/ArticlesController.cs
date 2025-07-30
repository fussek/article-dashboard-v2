using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using backend.Data;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq.Expressions;

[ApiController]
[Route("api/[controller]")]
public class ArticlesController : ControllerBase
{
    private readonly ApiDbContext _context;

    public ArticlesController(ApiDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetArticles(
        [FromQuery] string? articleCategory,
        [FromQuery] string? material,
        [FromQuery] List<string>? bicycleCategories,
        [FromQuery] string? sortBy,
        [FromQuery] bool isDescending = false,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _context.Articles.AsQueryable();

        if (!string.IsNullOrEmpty(articleCategory))
            query = query.Where(a => a.ArticleCategory == articleCategory);
        
        if (!string.IsNullOrEmpty(material))
            query = query.Where(a => a.Material == material);
        
        if (bicycleCategories != null && bicycleCategories.Any(s => !string.IsNullOrEmpty(s)))
        {
            var parameter = Expression.Parameter(typeof(Article), "a");
            var property = Expression.Property(parameter, nameof(Article.BicycleCategory));
            Expression orExpression = Expression.Constant(false);
            var containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) });

            foreach (var category in bicycleCategories.Where(c => !string.IsNullOrEmpty(c)))
            {
                var categoryConstant = Expression.Constant(category);
                var containsCall = Expression.Call(property, containsMethod!, categoryConstant);
                orExpression = Expression.OrElse(orExpression, containsCall);
            }
            
            var predicate = Expression.Lambda<Func<Article, bool>>(orExpression, parameter);
            query = query.Where(predicate);
        }

        if (!string.IsNullOrEmpty(sortBy))
        {
            switch (sortBy.ToLower())
            {
                case "articlenumber":
                    query = isDescending ? query.OrderByDescending(a => a.ArticleNumber) : query.OrderBy(a => a.ArticleNumber);
                    break;
                case "name":
                    query = isDescending ? query.OrderByDescending(a => a.Name) : query.OrderBy(a => a.Name);
                    break;
                case "category":
                    query = isDescending ? query.OrderByDescending(a => a.ArticleCategory) : query.OrderBy(a => a.ArticleCategory);
                    break;
                case "netweight":
                    query = isDescending ? query.OrderByDescending(a => a.NetWeightInGram) : query.OrderBy(a => a.NetWeightInGram);
                    break;
                default:
                     query = query.OrderBy(a => a.Name);
                    break;
            }
        }
        else
        {
            query = query.OrderBy(a => a.Name);
        }
        
        // Pagination
        var articles = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(articles);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetArticle(Guid id)
    {
        var article = await _context.Articles.FindAsync(id);
        if (article == null) return NotFound();
        return Ok(article);
    }

    [HttpPost]
    public async Task<IActionResult> CreateArticle(CreateArticleDto dto)
    {
        var article = new Article
        {
            Name = dto.Name,
            ArticleNumber = dto.ArticleNumber,
            ArticleCategory = dto.ArticleCategory,
            BicycleCategory = dto.BicycleCategory ?? "",
            Material = dto.Material,
            NetWeightInGram = dto.NetWeightInGram,
            LengthInMm = dto.LengthInMm,
            WidthInMm = dto.WidthInMm,
            HeightInMm = dto.HeightInMm
        };
        _context.Articles.Add(article);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetArticle), new { id = article.Id }, article);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateArticle(Guid id, CreateArticleDto dto)
    {
        var article = await _context.Articles.FindAsync(id);
        if (article == null) return NotFound();

        article.Name = dto.Name;
        article.ArticleNumber = dto.ArticleNumber;
        article.ArticleCategory = dto.ArticleCategory;
        article.BicycleCategory = dto.BicycleCategory ?? "";
        article.Material = dto.Material;
        article.NetWeightInGram = dto.NetWeightInGram;
        article.LengthInMm = dto.LengthInMm;
        article.WidthInMm = dto.WidthInMm;
        article.HeightInMm = dto.HeightInMm;

        await _context.SaveChangesAsync();
        return NoContent();
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteArticle(Guid id)
    {
        var article = await _context.Articles.FindAsync(id);
        if (article == null)
        {
            return NotFound();
        }

        _context.Articles.Remove(article);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("is-number-unique/{number}")]
    public async Task<IActionResult> IsArticleNumberUnique(string number)
    {
        var isUnique = !await _context.Articles.AnyAsync(a => a.ArticleNumber == number);
        return Ok(isUnique);
    }
}
