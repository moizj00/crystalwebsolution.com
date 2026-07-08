Start all services and open PM2 monitor.
```bash
cd "C:/Users/Sales/Crystal Web Solution" && pm2 start ecosystem.config.cjs && start wt.exe -d "C:/Users/Sales/Crystal Web Solution" pwsh -NoExit -c "pm2 monit"
```
