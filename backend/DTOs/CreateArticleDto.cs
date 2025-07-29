using System.ComponentModel.DataAnnotations;

public class CreateArticleDto
{
    [Required] 
    public string? ArticleNumber { get; set; }

    [Required]
    [StringLength(30, ErrorMessage = "Name cannot be longer than 30 characters.")]
    public string? Name { get; set; }

    [Required] 
    public string? ArticleCategory { get; set; }

    public string? BicycleCategory { get; set; }

    [Required] 
    public string? Material { get; set; }

    [Range(1, 10000)] 
    public int NetWeightInGram { get; set; }
    
    public int LengthInMm { get; set; }
    public int WidthInMm { get; set; }
    public int HeightInMm { get; set; }
}
