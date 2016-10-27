#!/usr/bin/env Rscript

args <- commandArgs(trailingOnly = TRUE);

sayHello <- function(){
   print(args)
}

sayHello()
