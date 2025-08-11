# تمرین دستگرمی سوم برنامه‌سازی وب

در این گزارش اجزای مختلف پروژه را توضیح می‌دهیم. توجه شود که برای اجرای این پروژه، لازم است که 
`postgresql`
در سیستم موجود باشد و یک دیتابیس به نام
`wpe3`
در آن موجود باشد که کاربری با نام کاربری
`wpe3user`
و رمز
`1234`
به آن دسترسی داشته باشد.

همچنین فرانت اند در دایرکتوری
`frontend`
موجود است و با اجرای دستور
`npm run dev`
اجرا می‌شود.

## کنترلرها

### لاگین

این بخش که در فایل
`src/controller/AuthController.java`
قرار دارد، عمل لاگین را انجام می‌دهد. ابتدا بررسی می‌کند که نام کاربری و رمز عبور قابل قبول هستند یا خیر، و در صورت غیر قابل قبول بودن، جواب مناسب (با خطای مناسب) را می‌دهد.

```java
Optional<User> userOpt = userRepository.findByUsername(userDTO.getUsername());
if (userOpt.isEmpty()) {
    return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Username doesn't exist");
}

User user = userOpt.get();
if (userDTO.getPassword() == null || !passwordEncoder.matches(userDTO.getPassword(), user.getPassword())) {
    return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Invalid password");
}
```

سپس کاربر را طبق خواسته‌های 
`Spring Security`
لاگین کرده و وارد 
`SecurityContextHolder`
کرده و پیغام موفقیت آمیز بودن را ارسال می‌کند.

```java
Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(userDTO.getUsername(), userDTO.getPassword())
);
SecurityContextHolder.getContext().setAuthentication(authentication);

request.getSession(true)
        .setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                SecurityContextHolder.getContext());

return ResponseEntity.ok("User logged in successfully");
```

### ثبت نام

ابتدا بررسی  می‌کند که نام کاربری تکراری است یا نه.

```java
if (userRepository.existsByUsername((userDTO.getUsername()))) {
    return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
}
```

سپس یک کاربر با نام کاربری و پسورد داده شده ساخته می‌شود.

```java
User user = new User();
user.setUsername(userDTO.getUsername());
user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
Painting painting = new Painting();
painting.setTitle("New Painting");
user.setPainting(painting);
userRepository.save(user);
```

و درنهایت پیغام موفقیت آمیز بودن ارسال می‌شود.

### دریافت نقاشی

این بخش که در فایل
`src/controller/PaintController.java`
ابتدا بررسی می‌کند که کاربری قبلا لاگین کرده است یا نه.

```java
String username = SecurityContextHolder.getContext().getAuthentication().getName();
Optional<User> userOpt = userRepository.findByUsername(username);

if (userOpt.isEmpty()) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
}
```

سپس از روی فیلد 
`painting`
کاربر، نقاشی را دریافت کرده و یک
`PaintingDTO`
از روی آن ساخته و آن را ارسال می‌کند.

```java
PaintingDTO paintingDTO = new PaintingDTO();
paintingDTO.setTitle(painting.getTitle());

List<ShapeDTO> shapeDTOs = painting.getAllShapes().stream().map(shape -> {
    ShapeDTO dto = new ShapeDTO();
    dto.setX(shape.getX());
    dto.setY(shape.getY());
    dto.setType(shape.getType());
    return dto;
}).toList();

paintingDTO.setAllShapes(shapeDTOs);

return ResponseEntity.ok(paintingDTO);
```

### ذخیره‌ی نقاشی

ابتدا بررسی می‌کند که کاربر وجود دارد یا نه، و در صورت وجود داشتن، نقاشی قبلی کاربر را حذف می‌کند.

```java
String username = SecurityContextHolder.getContext().getAuthentication().getName();
User user = userRepository.findByUsername(username).orElseThrow();

if (user.getPainting() != null) {
    Painting oldPainting = user.getPainting();
    user.setPainting(null);
    userRepository.save(user);
    paintingRepository.delete(oldPainting);
}
```

سپس برعکس فرایند بالا را انجام می‌دهد. یعنی از روی 
`PaintingDTO`
یک آبجکت از
`Painting`
می‌سازد و آن را ذخیره می‌کند.

```java
Painting painting = new Painting();
painting.setTitle(paintingDTO.getTitle());

List<Shape> shapes = paintingDTO.getAllShapes().stream().map(dto -> {
    Shape s = new Shape();
    s.setX(dto.getX());
    s.setY(dto.getY());
    s.setType(dto.getType());
    s.setPainting(painting);
    return s;
}).toList();

painting.setAllShapes(shapes);
user.setPainting(painting);

userRepository.save(user);
return ResponseEntity.ok("Painting saved");
```

## سایر اجزای کد

در دایرکتوری
`model`
و
`dto`
می‌توان کلاس‌های اصلی دیتابیس و 
`DTO`
آنها را مشاهده کرد.

در دایرکتوری 
`repository`
هم ریپازیتوری آنها قابل مشاهده است.

در فایل
`CorsConfig.java`
هم تنظیمات 
`CORS`
قابل مشاهده است، به طوری که فقط فرانت اند توانایی استفاده از 
`API call`
های بک اند را داشته باشد. (فقط لوکال هوست با پورت 5173)

در فایل
`SecurityConfig.java`
کارهای مربوط به
`Spring Security`
انجام شده اند.

## روش استفاده از برنامه

در صورت اجرای درست همه‌ی بخش‌ها، هنگام وارد شدن به
`localhost:5137`
با صفحه‌ی ثبت نام و لاگین مشاهده می‌شوید. در صورت خطا داشتن حین ثبت نام یا لاگین، آن خطا در پایین سمت راست صفحه نمایش داده می‌شود.

هنگام انجام موفقیت آمیز ثبت نام یا لاگین، به صفحه‌ی نقاشی منتقل می‌شوید. کارکرد آن مثل تمرین قبل است، فقط دکمه‌ی
`save`
اضافه شده است که نقاشی کاربر را سیو می‌کند.

## موارد استفاده از هوش مصنوعی

در این تمرین، برای نحوه‌ی اتصال به 
`postgresql`
و همچنین تنظیمات
`Cors`
از هوش مصنوعی کمک گرفتم. هردوی آنها، مواردی هستند که در اسلایدها و کلاس خیلی بهشان اشاره نشده بود، و برای اینکه وقت کمتری گرفته شود، از هوش مصنوعی کمک گرفتم.

همچنین در حذف نقاشی کاربر هنگام ذخیره‌ی نقاشی جدید به مشکل خوردم، به طوری که نقاشی از دیتابیس حذف نمی‌شد. برای رفع مشکل، از هوش مصنوعی کمک گرفتم و فهمیدم مشکل از این بود که ابتدا باید نقاشی برای کاربر
`null`
شود و بعد خود نقاشی حذف شود تا به مشکل نخوریم.