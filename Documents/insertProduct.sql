INSERT INTO dbo.product
        ( productId ,
          productName ,
          bgImageTop ,
          bgImageBottom ,
          description ,
          usage ,
          bestBefore ,
          manufacturer ,
          price ,
          quantity ,
          barCode ,
          qrCode
        )
VALUES  ( N'H10000260002412051630' , -- productId - nvarchar(50)
          N'Best product ever' , -- productName - nvarchar(50)
          N'../Content/img/bottle/bottle_top.jpg' , -- bgImageTop - nvarchar(50)
          N'../Content/img/bottle/bottle_bottom.jpg' , -- bgImageBottom - nvarchar(50)
          N'<b>Massage oil based on sunflower and sweet almond oil is enriched with lavander essential oil, rose geranium essential oil, rosemary essential oil.</b>' , -- description - nvarchar(2000)
          N'USAGE: Apply evenly and massage into skin. <br>CAUTION:For external use only. Avoid contact with eyes. Keep out of reach of children.' , -- usage - nvarchar(2000)
          N'EXP. DATE: 29.04.2016<br><br><br>After opening store in a cool and dark place.' , -- bestBefore - nvarchar(500)
          N'<b>Made in EU</b><br><br>MANUFACTURER: Vastok d.o.o., Dunajska cesta 136, 1000 Ljubljana, Slovenia.<br><b>www.alpstories.com</b>' , -- manufacturer - nvarchar(500)
          13.55 , -- price - float
          250 , -- quantity - int
          N'../Content/img/Codes/bc.png' , -- barCode - nvarchar(50)
          N'../Content/img/Codes/qr.png'  -- qrCode - nvarchar(50)
        )
/*
ALTER PROCEDURE dbo.p_getLabel
@productID NVARCHAR(50)
AS
--EXEC dbo.p_getLabel @productID='H10000260002412051630'

SELECT p.productId, p.productName, p.bgImageTop, p.bgImageBottom,  elements=STUFF((
SELECT ', '+ ingridientName FROM dbo.ingridient i INNER JOIN dbo.product_ingridient ip 
ON i.ingridientID = ip.ingridientID AND ip.productID=p.productID
FOR XML PATH('')),1,2, ''), p.description, p.usage, p.bestBefore, p.manufacturer, p.price, 
p.quantity, p.barCode, p.qrCode, p.icons
FROM product p WHERE p.productId=@productID
*/