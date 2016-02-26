DECLARE @PassedVariable VARCHAR(1000)
DECLARE @CMDSQL VARCHAR(1000)
SET @PassedVariable = ' --page-width 2400 --page-height 2100 --dpi 300 "http://localhost/panelEditorDesign/irina/svgTest.html" d:\Temp\zd\wkhtml\wkhtmltox\test\test.pdf'
SET @CMDSQL = ' d:\"My Projects"\PanelEditorDesign\PanelEditorDesign\Irina\wkhtmltopdf.exe ' + @PassedVariable
--PRINT @CMDSQL
EXEC master..xp_CMDShell @CMDSQL