babiesssss =read.table("./babiesssss.txt", header =T)
babiesssss = na.exclude(babiesssss)
fail = babiesssss$fail
babiesssss$fail =as.factor(fail)

p=0.7
index =sample(2, nrow(babiesssss), replace =TRUE, prob =c(p, 1-p))

babiesssss.train =babiesssss[index == 1, ]
babiesssss.test =babiesssss[index == 2, ]
nrow(babiesssss.train)

train.result = glm(fail ~ smart5 + smart9 + smart187 + smart192 +smart197 +smart198, data =babiesssss.train, family =binomial(link=logit))
summary(train.result)

print(train.result)

exp(train.result$coef)

confint(train.result)

exp(confint(train.result))

pred = predict(train.result, newdata =babiesssss.test, type ="response")
for(j in 1:562) {
  if (pred[j] <=0.385) pred[j]=0  else  pred[j]=1
}
pred = round(pred) 
tab = table(Y =babiesssss.test$fail, Ypred =pred)
catnames = levels(babiesssss.test$fail)
rownames(tab) = catnames 
colnames(tab) =catnames
tab

cat("正確分類比例 = ", 100*sum(diag(tab))/sum(tab), "% \n")
