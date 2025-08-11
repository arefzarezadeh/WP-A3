import { Button, Editable, FileUpload, Flex, useFileUpload, type FlexProps } from "@chakra-ui/react"
import type { Shape } from "./Canvas";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toaster } from "../components/ui/toaster";
import { getPainting, savePainting } from "../api/apicalls";
import { useNavigate } from "react-router-dom";
import type { PaintingDTO } from "../types";

interface HeaderProps extends FlexProps {
  shapes: Shape[],
  setShapes: Dispatch<SetStateAction<Shape[]>>
};

type CompleteCanvas = {
  allShapes: Shape[],
  title: string
};

const handleSave = (saveObj: CompleteCanvas) => {
  const blob = new Blob([JSON.stringify(saveObj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = saveObj.title + '.json';
  link.click();

  URL.revokeObjectURL(url);
  toaster.create({
    description: "File saved successfully",
    type: "info",
  });
};

const isCompleteCanvas = (obj: any): obj is CompleteCanvas => {
  return (
    typeof obj === 'object' &&
    typeof obj.title === 'string' &&
    Array.isArray(obj.allShapes) &&
    obj.allShapes.every(
      (shape: any) =>
        typeof shape.type === 'string' &&
        typeof shape.x === 'number' &&
        typeof shape.y === 'number'
    )
  );
};

const handleSaveToBack = async (painting: PaintingDTO) => {
  try {
    await savePainting(painting);
    toaster.create({
      description: "Saved Successfully.",
      type: "success"
    });
  } catch (err) {
    toaster.create({
      description: "Save Failed: " + err,
      type: "error"
    });
  }
};

const Header = ({shapes, setShapes, ...props}: HeaderProps) => {
  const [title, setTitle] = useState<string>('New Painting');
  const fileUpload = useFileUpload({
    maxFiles: 1,
    maxFileSize: 3000,
    accept: "application/json"
  });
  
  useEffect(() => {
    const file = fileUpload.acceptedFiles[0];
    if (!file) return;
  
    const reader = new FileReader();
  
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
  
        if (isCompleteCanvas(json)) {
          setTitle(json.title);
          setShapes(json.allShapes);
          toaster.create({
            description: "File loaded successfully",
            type: "info",
          });
        } else {
          toaster.create({
            description: "Invalid file structure",
            type: "error"
          });
        }
      } catch (err) {
        toaster.create({
          description: "Error parsing JSON: " + err,
          type: "error"
        });
      }
    };
  
    reader.readAsText(file);
  }, [fileUpload.acceptedFiles]);

  const navigate = useNavigate();

  useEffect(() => {
    getPainting().then((painting) => {
      if (!painting) {
        throw new Error("No shapes found");
      }
      setShapes(painting.allShapes);
      setTitle(painting.title);
      console.log(painting);
    }).catch(() => {
      toaster.create({
        description: "Failed to load painting. Redirecting to login page...",
        type: "error"
      });
      navigate('/login');
    });
  }, []);

  return (
    <Flex justify="space-between" align="center" paddingX={5} paddingY={2} h="8%" {...props}>
      <Flex gap={4}>
        <Button onClick={() => navigate('/login')}>Back to Login</Button>
        <Editable.Root 
          value={title}
          onValueChange={(e) => setTitle(e.value)}
          activationMode="dblclick"
          w={200}
          size="lg"
        >
          <Editable.Preview  />
          <Editable.Input />
        </Editable.Root>
      </Flex>
      <Flex gap={4}>
        <Button onClick={() => handleSaveToBack({title: title, allShapes: shapes})}>Save</Button>
        <Button onClick={() => handleSave({title: title, allShapes: shapes})}>Export</Button>
        <FileUpload.RootProvider value={fileUpload}>
        <FileUpload.HiddenInput />
        <FileUpload.Trigger asChild>
          <Button>
            Import
          </Button>
        </FileUpload.Trigger>
      </FileUpload.RootProvider>
      </Flex>
    </Flex>
  );
};

export default Header;