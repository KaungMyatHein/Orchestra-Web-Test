# Orchestra ဒီဇိုင်းစနစ် ထပ်တူပြုခြင်း လုပ်ငန်းစဉ်

ဤစာတမ်းသည် `.github/workflows/design-syncs.yml` ဖိုင်အကြောင်း ရှင်းပြထားပါသည်။ ၎င်းသည် တိုကင် (token) ဖိုင်များ အပ်ဒိတ်လုပ်သည့်အခါတိုင်း ဒီဇိုင်းတိုကင်များကို အလိုအလျောက် ထုတ်လုပ်ပေးပြီး ထပ်တူပြုပေးသော လုပ်ငန်းစဉ် ဖြစ်ပါသည်။

## လုပ်ငန်းစဉ် အစပြုအချက်များ

```yaml
on:
  push:
    paths:
      - 'tokens/**/*.json'
```

`tokens` ဖိုင်တွဲ (သို့မဟုတ် ၎င်း၏ လက်အောက်ခံ ဖိုင်တွဲများ) အတွင်းရှိ `.json` ဖိုင်များတွင် အပြောင်းအလဲများ ပါဝင်သော `push` ပြုလုပ်သည့်အခါတိုင်း ဤလုပ်ငန်းစဉ်သည် အလိုအလျောက် စတင်ပါသည်။

## တပြိုင်နက် လုပ်ဆောင်မှု ထိန်းချုပ်ခြင်း

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

၎င်းသည် push အကြိမ်များစွာကို လျင်မြန်စွာ ပြုလုပ်ပါက နောက်ဆုံးတစ်ခုကိုသာ အလုပ်လုပ်စေရန် သေချာစေပါသည်။ တူညီသော branch အတွက် လုပ်ဆောင်နေဆဲဖြစ်သော ယခင်လုပ်ငန်းစဉ်များကို ဖျက်သိမ်းပြီး အရင်းအမြစ်များကို သက်သာစေကာ ပဋိပက္ခများကို ရှောင်ရှားစေပါသည်။

## အလုပ်အသေးစိတ်: `build-tokens`

အလုပ်လုပ်သည့်စနစ်: `ubuntu-latest`
ခွင့်ပြုချက်များ: `contents: write` (ထုတ်လုပ်လိုက်သော ဖိုင်များကို repo သို့ ပြန်လည် push လုပ်ရန် လိုအပ်သည်)

### အဆင့်များ

#### 1. Checkout Repository
```yaml
uses: actions/checkout@v4
with:
  fetch-depth: 0 
```
ကုဒ်များကို ဒေါင်းလုဒ်လုပ်ပါသည်။ `fetch-depth: 0` သည် rebase ကဲ့သို့သော git လုပ်ငန်းစဉ်များအတွက် အရေးကြီးသော မှတ်တမ်းအပြည့်အစုံကို ရယူပါသည်။

#### 2. Setup Node.js
```yaml
uses: actions/setup-node@v4
with:
  node-version: '22'
```
Build script များအတွက် လိုအပ်သော Node.js ဗားရှင်း 22 ကို ထည့်သွင်းပါသည်။

#### 3. Install Dependencies
```yaml
run: npm ci
```
`package-lock.json` အပေါ် အခြေခံ၍ ပရောဂျက်အတွက် လိုအပ်သည်များကို တိကျစွာ ထည့်သွင်းပါသည်။

#### 4. Pull Latest Changes
```yaml
run: git pull origin main --rebase
```
ဖိုင်အသစ်များ မထုတ်လုပ်မီ ပဋိပက္ခများ (merge conflicts) မဖြစ်စေရန် main branch မှ နောက်ဆုံးရ ကုဒ်များကို ရယူပါသည်။

#### 5. Run Build Script
```yaml
run: npm run tokens
```
JSON တိုကင်များကို အလုပ်လုပ်ရန်နှင့် Web, Android, iOS, နှင့် Flutter တို့အတွက် ကုဒ်များ ထုတ်လုပ်ရန် စိတ်ကြိုက်ရေးသားထားသော build script (`build.js`) ကို run ပါသည်။

#### 6. Debug Generated Outputs
```yaml
run: ... ls -la ...
```
ဖိုင်များ အမှန်တကယ် ထွက်ရှိလာကြောင်း စစ်ဆေးရန် output ဖိုင်တွဲများ၏ အကြောင်းအရာများကို စာရင်းပြုစု ပြသပါသည်။

#### 7. Commit Generated Files
```yaml
run: |
  git config user.name "github-actions[bot]" ...
  [ -d "src/styles" ] && git add src/styles/*.css src/styles/*.ts ...
  git commit -m "🎨 Design Token Updates"
  git push
```
- Git အသုံးပြုသူကို bot အဖြစ် သတ်မှတ်ပါသည်။
- Output ဖိုင်တွဲများ ရှိမရှိ စစ်ဆေးပြီး ထွက်ရှိလာသော ဖိုင်များ (`.css`, `.ts`, `.swift`, `.kt`, `.dart`) ကို git သို့ ထည့်သွင်း (add) ပါသည်။
- ပြောင်းလဲမှုများ ရှိပါက "🎨 Design Token Updates" ခေါင်းစဉ်ဖြင့် commit လုပ်ပြီး repository သို့ ပြန်လည် push လုပ်ပါသည်။
