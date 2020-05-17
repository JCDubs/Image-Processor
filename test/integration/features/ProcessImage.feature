Feature: image file update
    Background:
        Given the application is running
        Then the buckets directory should exist
        And the 'site-images-dev' bucket should exist
        And the 'image-sandbox-dev' bucket should exist

    Scenario: Upload a large jpeg to the content directory.
        Given the 'site-images-dev/banner/LARGE_elevation.jpg' image file does not exist
        And the 'image-sandbox-dev/banner/LARGE_elevation.jpg' image file does not exist
        When I upload the 'canned-data/images/LARGE_elevation.jpg' image file to the 'image-sandbox-dev' bucket with key 'banner/LARGE_elevation.jpg'
        And I wait 4000 milliseconds
        Then the 'banner/LARGE_elevation.jpg' image should be present in the 'site-images-dev' bucket
        And the 'banner/LARGE_elevation.jpg' image size should be 1400 wide and 350 high

    Scenario: Upload a large png to the content directory.
        Given the 'site-images-dev/banner/map.jpg' image file does not exist
        And the 'image-sandbox-dev/banner/map.png' image file does not exist
        When I upload the 'canned-data/images/map.png' image file to the 'image-sandbox-dev' bucket with key 'banner/map.png'
        And I wait 4000 milliseconds
        Then the 'banner/map.jpg' image should be present in the 'site-images-dev' bucket
        And the 'banner/map.jpg' image size should be 1400 wide and 350 high
