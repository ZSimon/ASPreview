--EXEC dbo.p_generateClass @TableName = 'product'

SELECT * FROM product
SELECT * FROM scent

--EXEC dbo.p_getLabel @productID='H10000260002412051630'
/*
INSERT INTO dbo.product( productId, groupId, productName, bgImageTop, bgImageBottom, elements, description, usage,
bestBefore, manufacturer, price, quantity, barCode, qrCode, icons, template, min, max, scentId)
VALUES  ( N'24' , -- productId - nvarchar(50)
		  6,
          N'Shower Gel Vanilla' , -- productName - nvarchar(50)
          N'/Content/img/bottle/bottle-30-top.jpg' , -- bgImageTop - nvarchar(50)
          N'/Content/img/bottle/bottle-30-bottom.jpg' , -- bgImageBottom - nvarchar(50)
		  N'INGREDIENTS: Aqua and Sodium Coco-Sulfate and Coco-Glucoside and Sodium Chloride and Glyceryl Oleate andLauryl Glucoside and Stearyl Citrate and Sodium Benzoate and Potassium Sorbate and Citric Acid, Parfum, Zingiber Officinale Root Extract and Propylene Glycol and Aqua, d-Limonene, Linalool, Coumarin,Eugenol, Benzyl Benzoate.',
          N'<b>Mild shower gel with ginger extract and natural fragrance from vanilla gently cleanses your skin with out drying out.</b>' ,
          N'USE: Apply to damp skin, lather, and then rinse.<br>CAUTION: For external use only. Avoid contact with eyes. Keep out of reach of children.' , -- usage - nvarchar(2000)
          N'Best before: XX.XX.XXXX<br>After opening the product should be used within 6 months.<br>Layering does not affect the quality of the product. Shake before use.' , -- bestBefore - nvarchar(500)
          N'<b>Made in EU</b><br>MANUFACTURER: Vastok d.o.o., Dunajska cesta 136, 1000 Ljubljana, Slovenia.<br><b>www.alpstories.com</b>' , -- manufacturer - nvarchar(500)
          10.0 , -- price - float
          30 , -- quantity - int
          N'../Content/img/Codes/bc.png' , -- barCode - nvarchar(50)
          N'../Content/img/Codes/qr.png' , -- qrCode - nvarchar(50)
          N'../Content/img/zajecBlk.svg,../Content/img/arrowBlk.svg,../Content/img/kosBlk.svg,../Content/img/PE4.svg,../Content/img/6M.svg',
		  N'../Content/ASTemplates/SGVanilla_3.svg',
		  0.5, 0.8, 4
        )
*/

/*
INSERT INTO dbo.product( productId, groupId, productName, bgImageTop, bgImageBottom, elements, description, usage,
bestBefore, manufacturer, price, quantity, barCode, qrCode, icons, template, min, max, scentId)
VALUES  ( N'12' , -- productId - nvarchar(50)
		  3,
          N'Shower Gel Vanilla' , -- productName - nvarchar(50)
          N'/Content/img/bottle/bottle-220-top.jpg' , -- bgImageTop - nvarchar(50)
          N'/Content/img/bottle/bottle-220-bottom.jpg' , -- bgImageBottom - nvarchar(50)
		  N'INGREDIENTS: Aqua and Sodium Coco-Sulfate and Coco-Glucoside and Sodium Chloride and Glyceryl Oleate andLauryl Glucoside and Stearyl Citrate and Sodium Benzoate and Potassium Sorbate and Citric Acid, Parfum, Zingiber Officinale Root Extract and Propylene Glycol and Aqua, d-Limonene, Linalool, Coumarin,Eugenol, Benzyl Benzoate.',
          N'<b>Mild shower gel with ginger extract and natural fragrance from vanilla gently cleanses your skin with out drying out.</b>' ,
          N'USE: Apply to damp skin, lather, and then rinse.<br>CAUTION: For external use only. Avoid contact with eyes. Keep out of reach of children.' , -- usage - nvarchar(2000)
          N'Best before: XX.XX.XXXX<br>After opening the product should be used within 6 months.<br>Layering does not affect the quality of the product. Shake before use.' , -- bestBefore - nvarchar(500)
          N'<b>Made in EU</b><br>MANUFACTURER: Vastok d.o.o., Dunajska cesta 136, 1000 Ljubljana, Slovenia.<br><b>www.alpstories.com</b>' , -- manufacturer - nvarchar(500)
          15.0 , -- price - float
          220 , -- quantity - int
          N'../Content/img/Codes/bc.png' , -- barCode - nvarchar(50)
          N'../Content/img/Codes/qr.png' , -- qrCode - nvarchar(50)
          N'../Content/img/zajecBlk.svg,../Content/img/arrowBlk.svg,../Content/img/kosBlk.svg,../Content/img/HDPE1.svg,../Content/img/6M.svg',
		  N'../Content/ASTemplates/SGVanilla_1.svg',
		  1.5, 1.8, 4
        )
*/			


--SELECT * FROM product ORDER BY CAST(productId AS INT)
/*
INSERT INTO dbo.category( categoryId, name )
VALUES  ( 1, -- categoryId - int
          N'Scent'  -- name - nvarchar(50)
          )

INSERT INTO dbo.product_category
        ( productId, categoryId, removable, editable )

SELECT productId, 1, 0 , 1 FROM product
*/

Mild shower gel with ginger extract  and natural fragrance from vanilla gently cleanses your skin with out drying out.