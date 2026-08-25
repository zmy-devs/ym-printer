[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;

Get-Printer |
    ForEach-Object {
        $canDuplex = $false;

        try {
            $printerSettings = [System.Drawing.Printing.PrinterSettings]::new();
            $printerSettings.PrinterName = $_.Name;
            $canDuplex = $printerSettings.IsValid -and $printerSettings.CanDuplex;
        }
        catch {
            $canDuplex = $false;
        }

        [PSCustomObject]@{
            name = $_.Name;
            canDuplex = $canDuplex;
        }
    } |
    ConvertTo-Json -Compress
