-- Custom SQL migration file, put you code below! --
INSERT INTO `images` (`image_id`, `created_at`, `user_email_id`)
VALUES
('sample1.jpeg', TIMESTAMP('2023-11-02'), 'potato@potato.com'),
('sample2.jpeg', TIMESTAMP('2023-11-03'), 'foo@bar.com'),
('sample3.jpeg', TIMESTAMP('2023-11-04'), 'foo@bar.com'),
('sample4.jpeg', TIMESTAMP('2023-11-05'), 'test@abcd.com'),
('sample5.jpeg', TIMESTAMP('2023-11-06'), 'test@abcd.com'),
('sample6.jpeg', TIMESTAMP('2023-11-07'), 'foo@bar.com'),
('sample7.jpeg', TIMESTAMP('2023-11-08'), 'foo@bar.com'),
('sample8.jpeg', TIMESTAMP('2023-11-09'), 'foo@bar.com'),
('sample9.jpeg', TIMESTAMP('2023-11-10'), 'foo@bar.com');