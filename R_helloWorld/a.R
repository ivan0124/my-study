#!/usr/bin/env Rscript

args <- commandArgs(trailingOnly = TRUE);

sayHello <- function(){
   print(args)
}

sayHello()

#pass exit code 85 to nodejs
quit(save = "no", status = 85, runLast = FALSE)
