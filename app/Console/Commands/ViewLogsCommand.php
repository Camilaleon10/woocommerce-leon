<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ViewLogsCommand extends Command
{
    protected $signature = 'logs:view {--tail=10 : Number of lines to show}';
    protected $description = 'View Laravel logs in real-time';

    public function handle()
    {
        $tail = $this->option('tail');
        $logFile = storage_path('logs/laravel.log');
        
        $this->info("Log file: {$logFile}");
        $this->info("File exists: " . (file_exists($logFile) ? 'YES' : 'NO'));
        $this->info("File size: " . (file_exists($logFile) ? filesize($logFile) : '0') . " bytes");
        
        if (!file_exists($logFile)) {
            $this->error('Log file does not exist');
            return 1;
        }
        
        if (filesize($logFile) == 0) {
            $this->warn('Log file is empty. Try to perform an action first.');
            return 0;
        }
        
        $this->info("Watching Laravel logs (last {$tail} lines)...");
        $this->info("Press Ctrl+C to stop\n");
        $this->line(str_repeat('-', 80));
        
        // Show last N lines first
        $content = file_get_contents($logFile);
        $lines = explode("\n", $content);
        $lastLines = array_slice($lines, -$tail);
        
        foreach ($lastLines as $line) {
            if (!empty(trim($line))) {
                $this->line($line);
            }
        }
        
        $this->line(str_repeat('-', 80));
        $this->info("Waiting for new logs...");
        
        // Continue watching for new lines
        $lastSize = filesize($logFile);
        
        while (true) {
            clearstatcache();
            $currentSize = filesize($logFile);
            
            if ($currentSize > $lastSize) {
                $handle = fopen($logFile, 'r');
                fseek($handle, $lastSize);
                
                while (!feof($handle)) {
                    $newLine = fgets($handle);
                    if (!empty(trim($newLine))) {
                        $this->line($newLine);
                    }
                }
                
                fclose($handle);
                $lastSize = $currentSize;
            }
            
            usleep(500000); // Wait 500ms
        }
        
        return 0;
    }
}