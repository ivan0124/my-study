#features.selected <- c("failure", "smart_5_raw", "smart_9_raw","smart_187_raw", "smart_192_raw", "smart_197_raw", "smart_198_raw")
features.selected <- c("failure", "smart_5_raw", "smart_9_raw","smart_187_raw", "smart_192_raw", "smart_197_raw")

# read data
hdd.data <- read.csv(file = "Hdd-data.csv", header = TRUE, stringsAsFactors = FALSE)
hdd.data <- hdd.data[, names(hdd.data) %in% features.selected]
hdd.data$failure <- as.factor(hdd.data$failure)
colnames(hdd.data) <- c("failure", "smart5", "smart9", "smart187", "smart192", "smart197")

# replace missing data with 0
for(i in 2:ncol(hdd.data)){
  missing <- is.na(hdd.data[, i])
  hdd.data[missing, i] <- 0
}

# remove columnes with code 9 = 0
if (sum(hdd.data$smart_9_raw == 0) != 0) {
  hdd.data <- hdd.data[-which(hdd.data$smart_9_raw == 0), ]
}

# apply SMOTE
require(DMwR)
hdd.data <- SMOTE(failure ~ ., hdd.data, perc.over =600, perc.under = 100)

# split train/test data
hdd.data <- hdd.data[sample(nrow(hdd.data)), ]
split.hdd <- round(nrow(hdd.data) * 0.7)
hdd.data.train <- hdd.data[1:split.hdd,]
hdd.data.test <- hdd.data[(split.hdd +1):nrow(hdd.data), ]

#strip function  
stripGlmLR = function(cm) {
  cm$y = c()
  cm$model = c()
  
  cm$residuals = c()
  cm$fitted.values = c()
  cm$effects = c()
  cm$qr$qr = c()  
  cm$linear.predictors = c()
  cm$weights = c()
  cm$prior.weights = c()
  cm$data = c()
  
  
  cm$family$variance = c()
  cm$family$dev.resids = c()
  cm$family$aic = c()
  cm$family$validmu = c()
  cm$family$simulate = c()
  attr(cm$terms,".Environment") = c()
  attr(cm$formula,".Environment") = c()
  
  cm
}

# train model
model.logi <- stripGlmLR(glm(failure ~ ., data = hdd.data.train, family =binomial(link=logit)))
object.size(model.logi)
save(model.logi, file = "Model.RData")


# predict
pred.logi <- predict(model.logi, newdata = hdd.data.test, type ="response")
pred.logi.class <-  ifelse(pred.logi <= 0.36, 0, 1)


## run testing
tab.logi = table(True = hdd.data.test$failure, Pred =pred.logi.class)
tab.logi
cat("accuracy of logistic regression model =  ", 100*sum(diag(tab.logi))/sum(tab.logi), "% \n")
