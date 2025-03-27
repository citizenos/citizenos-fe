import { TestBed } from '@angular/core/testing';
import { ImageService } from './images.service';

describe('ImageService', () => {
  let service: ImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update images and emit the new value', (done) => {
    const mockImages = [{ id: 1, link: 'image1.jpg' }, { id: 2, link: 'image2.jpg' }];

    service.updateImages(mockImages);

    service.images$.subscribe((images) => {
      expect(images).toEqual(mockImages);
      done();
    });
  });

  it('should set loading state to true', (done) => {
    service.setLoading(true);

    service.loading$.subscribe((isLoading) => {
      expect(isLoading).toBeTrue();
      done();
    });
  });

  it('should set loading state to false', (done) => {
    service.setLoading(false);

    service.loading$.subscribe((isLoading) => {
      expect(isLoading).toBeFalse();
      done();
    });
  });

  it('should emit updated images after multiple updates', (done) => {
    const initialImages = [{ id: 1, link: 'image1.jpg' }];
    const newImages = [{ id: 2, link: 'image2.jpg' }];

    service.updateImages(initialImages);
    service.updateImages(newImages);

    service.images$.subscribe((images) => {
      expect(images).toEqual(newImages);
      done();
    });
  });
});