
print("1====================================\n")

load("model.RData")
exp(train.result$coef)

confint(train.result)

exp(confint(train.result))

test_data =read.table("./test_data.txt", header =T)
pred = predict(train.result, newdata =test_data, type ="response")
for(j in 1:nrow(test_data)) {
  if (pred[j] <=0.385) pred[j]=0  else  pred[j]=1
}
print(pred)
print("2====================================\n")
pred = round(pred) 
print(pred)
print("3====================================\n")
